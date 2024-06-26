import {
  ConflictException,
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from './entity/user.entity';
import { MoreThanOrEqual, Not, Repository } from 'typeorm';
import { CACHE_MANAGER, Cache } from '@nestjs/cache-manager';
import { SmsService } from 'src/sms/sms.service';
import { UserResponseDto } from './dto/user-response.dto';
import { plainToClass, plainToInstance } from 'class-transformer';
import { RegisterUserDto } from './dto/registerUser.dto';
import { UserFollowService } from './user-follow.service';
import { SimpleUserDto } from './dto/simple-user-response.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    private smsService: SmsService,
    private userFollowService: UserFollowService,
  ) {}

  async getRankUserList(): Promise<SimpleUserDto[]> {
    const rankUserList = await this.userRepository.find({
      where: {
        instagramId: Not(''),
      },
      order: {
        view: {
          todayCnt: 'DESC',
          totalCnt: 'DESC',
        },
      },
    });
    return plainToInstance(SimpleUserDto, rankUserList);
  }

  async editMobile(
    user: UserEntity,
    mobile: string,
    authKey: string,
  ): Promise<void> {
    const cacheAuthKey = await this.cacheManager.get(`mobile_${mobile}`);
    if (cacheAuthKey !== authKey) {
      throw new HttpException(
        '인증번호가 올바르지 않습니다',
        HttpStatus.BAD_REQUEST,
      );
    }
    user.privacy.mobile = mobile;
    await user.save();
  }

  async sendAuthKey(mobile: string): Promise<void> {
    let authKey = '';
    new Array(4).fill(null).forEach((_) => {
      authKey += Math.floor(Math.random() * 10);
    });
    if (await this.cacheManager.get(`mobile_${mobile}`)) {
      await this.cacheManager.del(`mobile_${mobile}`);
    }
    await this.cacheManager.set(`mobile_${mobile}`, authKey, 1000 * 60 * 3);
    const message = `루키즈 인증번호입니다. [${authKey}] - 3분내로 입력해주세요`;
    await this.smsService.sendSms(mobile, message);
  }

  async registerUser(registerUserDto: RegisterUserDto): Promise<UserEntity> {
    const user = await this.userRepository.findOneBy({
      privacy: [
        {
          email: registerUserDto.privacy.email,
        },
        { mobile: registerUserDto.privacy.mobile },
      ],
    });
    if (user) {
      throw new HttpException('이미 존재하는 유저입니다', HttpStatus.FOUND);
    }
    //
    let randomNickname = 'rudkid_';
    randomNickname += Math.random().toString(36).substring(2, 6);
    const sameNicknameUser = await this.userRepository.findOneBy({
      nickname: randomNickname,
    });
    if (sameNicknameUser) {
      return await this.registerUser(registerUserDto);
    }
    const createdUser = await this.userRepository
      .create({
        privacy: {
          ...registerUserDto.privacy,
        },
        nickname: randomNickname,
        instagramId: '',
        imageUrl: '',
      })
      .save();
    return createdUser;
  }

  async updateImageUrl(user: UserEntity, imageUrl: string) {
    user.imageUrl = imageUrl;
    await user.save();
  }

  async updateNickname(user: UserEntity, nickname: string): Promise<void> {
    const sameNickUser = await this.userRepository.findOneBy({
      nickname: nickname,
    });
    if (sameNickUser)
      throw new ConflictException('같은 닉을 가진 유저가 있어용');
    user.nickname = nickname;
    await user.save();
    return;
  }

  async updateInstagramId(
    user: UserEntity,
    instagramId: string,
  ): Promise<void> {
    let links = user.links.split(',');
    const beforeInstaLink = links.find(
      (link_) => link_.includes('instagram') && link_.includes(instagramId),
    );
    links = links.filter((link_) => link_ !== beforeInstaLink);
    user.links = `https://www.instagram.com/${instagramId}`;
    links?.forEach((link) => (user.links += `,${link}`));
    user.instagramId = instagramId;
    await user.save();
  }

  async updateIntroduce(user: UserEntity, introduce: string): Promise<void> {
    user.introduce = introduce;
    await user.save();
  }

  async updateLinks(user: UserEntity, links: string[]): Promise<void> {
    links = links?.filter((link) => link);
    user.links = '';
    links?.map((link) => (user.links += `${link},`));
    user.links = user.links.substring(0, user.links.length - 1);
    await user.save();
  }

  async getMe(user: UserEntity): Promise<UserResponseDto> {
    const links = user.links?.split(',')?.filter((link_) => link_);
    const followerCnt = await this.userFollowService.getUserFollowerCnt(
      user.nickname,
    );
    const rank = await this.getUserRank(user);
    return plainToClass(UserResponseDto, { ...user, followerCnt, links, rank });
  }

  async getOtherUser(me: UserEntity, userId: string) {
    const user = await this.userRepository.findOneBy({ id: userId });
    if (!user) throw new NotFoundException();
    const followerCnt = await this.userFollowService.getUserFollowerCnt(
      user.nickname,
    );
    const links = user.links.split(',')?.filter((link_) => link_);
    let isFollower = false;
    if (me) {
      isFollower = await this.userFollowService.isFollower(me, userId);
    }
    const rank = await this.getUserRank(user);
    return plainToClass(UserResponseDto, {
      ...user,
      rank,
      followerCnt,
      isFollower,
      links,
    });
  }

  async updateTodayView(userId: string): Promise<void> {
    const user = await this.userRepository.findOneBy({
      id: userId,
    });
    if (!user) throw new NotFoundException();
    user.view.todayCnt++;
    await user.save();
  }

  async updateCardImgUrl(user: UserEntity, cardImgUrl: string) {
    user.cardImgUrl = cardImgUrl;
    await user.save();
  }

  async setFirstInviteFinished(user: UserEntity): Promise<void> {
    user.isFirstInviteFinished = true;
    await user.save();
  }

  async deleteUser(user: UserEntity) {
    //
    await user.remove();
  }

  private async getUserRank(user: UserEntity): Promise<number> {
    const rank = await this.userRepository.countBy({
      instagramId: Not(''),
      view: {
        totalCnt: MoreThanOrEqual(user.view.totalCnt),
        todayCnt: MoreThanOrEqual(user.view.todayCnt),
      },
    });
    return rank;
  }
}
