import {
  ConflictException,
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  NotFoundException,
  OnModuleInit,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from './entity/user.entity';
import { DataSource, In, MoreThanOrEqual, Repository } from 'typeorm';
import { CACHE_MANAGER, Cache } from '@nestjs/cache-manager';
import { SmsService } from 'src/sms/sms.service';
import { UserResponseDto } from './dto/response/user.dto';
import { plainToClass, plainToInstance } from 'class-transformer';
import { StartSignUpDto } from './dto/request/start-sign-up.dto';
import { UserFollowService } from './user-follow.service';
import { SimpleUserDto } from './dto/response/simple-user.dto';
import { nanoid } from 'nanoid';
import { OnboardingStepEnum } from './entity/enum/onboarding-step.enum';

@Injectable()
export class UserService implements OnModuleInit {
  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    private smsService: SmsService,
    private userFollowService: UserFollowService,
    private dataSource: DataSource,
  ) {}

  public static readonly startWaitingOrder: number = 1;
  public static limitOnboardingFinishCnt: number = 0;

  async onModuleInit() {
    UserService.limitOnboardingFinishCnt = Number(
      process.env['LIMIT_ONBOARDING_FINISH_CNT'],
    );
    const d = await this.getOnboardingFinishedCnt();
    console.log(d, '-dd');
    await this.shiftWaitingUsers();
  }

  async getViewRankUsers(): Promise<SimpleUserDto[]> {
    const rankUserList = await this.userRepository.find({
      where: {
        onboardingStep: OnboardingStepEnum.FINISHED,
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

  async getOnboardingFinishedCnt(): Promise<number> {
    const totalUserCnt = await this.userRepository.countBy({
      onboardingStep: OnboardingStepEnum.FINISHED,
    });
    return totalUserCnt;
  }

  async shiftWaitingUsers(): Promise<void> {
    const onbardingFinishedCnt = await this.getOnboardingFinishedCnt();

    const remainOnboardingFinishedUserCnt = //남은온보딩완료유저수
      UserService.limitOnboardingFinishCnt - onbardingFinishedCnt; //대기 인원에서 시프트 시킬 수 있는 인원.

    if (remainOnboardingFinishedUserCnt <= 0) return;
    let waitingUsers = [];
    await this.dataSource.transaction(async (manager) => {
      waitingUsers = await manager.find(UserEntity, {
        where: {
          onboardingStep: OnboardingStepEnum.WAITING,
        },
        order: {
          waitingOrder: 'ASC',
        },
        take: remainOnboardingFinishedUserCnt,
      });
      await manager.update(
        UserEntity,
        {
          id: In(waitingUsers?.map((user) => user.id)),
        },
        {
          onboardingStep: OnboardingStepEnum.FINISHED,
          waitingOrder: null,
        },
      );
      await manager
        .createQueryBuilder(UserEntity, 'user')
        .where('onboardingStep = :onboardingStep', {
          onboardingStep: OnboardingStepEnum.WAITING,
        })
        .update(UserEntity)
        .set({
          waitingOrder: () =>
            `waitingOrder - ${remainOnboardingFinishedUserCnt}`,
        })
        .execute();
    });
    this.sendNotificationForWaitedUsers(waitingUsers);
  }

  private sendNotificationForWaitedUsers(waitedUsers: UserEntity[]): void {
    waitedUsers?.map(async (waitedUser: UserEntity) => {
      await this.smsService
        .sendSms(
          waitedUser.privacy.mobile,
          `안녕! ${waitedUser.nickname}님, Rudkids 대기 상태에서 활성상태로 변경되었어요! 계속해서 진행하기 -> https://www.rud.kids/continue`,
        )
        .catch((e) => {
          throw e;
        });
    });
  }

  async shiftMyWaitingOrder(
    user: UserEntity,
    shiftAmount: number,
  ): Promise<void> {
    if (user.onboardingStep !== OnboardingStepEnum.WAITING) {
      throw new ConflictException('당신은 대기중인 인원이 아닙니다');
    }
    if (user.waitingOrder === UserService.startWaitingOrder) return;
    let targetWaitingOrder = user.waitingOrder - shiftAmount;
    if (targetWaitingOrder < UserService.startWaitingOrder) {
      targetWaitingOrder = UserService.startWaitingOrder;
    }
    return await this.dataSource.transaction(async (manager) => {
      manager
        .createQueryBuilder(UserEntity, 'user')
        .where('onboardingStep = :onboardingStep', {
          onboardingStep: OnboardingStepEnum.WAITING,
        })
        .andWhere('watingOrder < :waitingOrder', {
          watingOrder: user.waitingOrder,
        })
        .andWhere('waitingOrder > :targetWaitingOrder', {
          targetWaitingOrder,
        })
        .update(UserEntity)
        .set({
          waitingOrder: () => `waitingOrder + ${shiftAmount}`,
        });
      await manager.update(
        UserEntity,
        {
          id: user.id,
        },
        {
          waitingOrder: targetWaitingOrder,
        },
      );
    });
  }

  private async findLastWaitingUser(): Promise<UserEntity> {
    const lastWaitingUser = await this.userRepository.findOne({
      where: {
        onboardingStep: OnboardingStepEnum.WAITING,
      },
      order: {
        waitingOrder: 'DESC',
      },
    });
    return lastWaitingUser;
  }

  private async generateNewNickname(): Promise<string> {
    let randomNickname = 'rudkid_';
    randomNickname += Math.random().toString(36).substring(2, 6);
    const sameNicknameUser = await this.userRepository.findOneBy({
      nickname: randomNickname,
    });
    if (sameNicknameUser) {
      return await this.generateNewNickname();
    }
    return randomNickname;
  }

  async signUp(StartSignUpDto: StartSignUpDto): Promise<UserEntity> {
    const user = await this.userRepository.findOneBy({
      privacy: { mobile: StartSignUpDto.privacy.mobile },
    });
    if (user)
      throw new HttpException(
        `회원님께서는 이미 ${user.platform ?? '자체로그인'}으로 가입되어있습니다!`,
        HttpStatus.FOUND,
      );
    const createdUser = new UserEntity();
    createdUser.id = nanoid();
    createdUser.privacy = StartSignUpDto.privacy;
    createdUser.platform = StartSignUpDto.platform;
    createdUser.nickname = await this.generateNewNickname();
    createdUser.onboardingStep = OnboardingStepEnum.COMPLETE_SIGNUP;
    await createdUser.save();
    return createdUser;
  }

  async setInstgram(user: UserEntity, setInstagramDto: any): Promise<void> {
    user.instagram.instagramId = setInstagramDto.instagramId;
    user.instagram.imageUrl = setInstagramDto.imageUrl;
    let links: string[] = JSON.parse(user.links);
    const link = `https://www.instagram.com/${user.instagram.instagramId}`;
    links = links?.filter((link_) => link_ === link) ?? [];
    user.links = JSON.stringify([...links, link]);
    if (user.onboardingStep === OnboardingStepEnum.COMPLETE_ACCEPT_INVITATION) {
      user.onboardingStep = OnboardingStepEnum.COMPLETE_SET_INSTAGRAM;
    }
    await user.save();
  }

  async requestFinishOnboarding(user: UserEntity): Promise<void> {
    if (user.onboardingStep !== OnboardingStepEnum.COMPLETE_SET_INSTAGRAM) {
      throw new HttpException(
        '회원님은 완료 전단계가 아닙니다!',
        HttpStatus.METHOD_NOT_ALLOWED,
      );
    }
    const onboardingFinishedCnt = await this.getOnboardingFinishedCnt();
    const lastWaitingUser: UserEntity = await this.findLastWaitingUser();

    if (lastWaitingUser) {
      console.log('1');
      user.waitingOrder = lastWaitingUser.waitingOrder + 1;
      user.onboardingStep = OnboardingStepEnum.WAITING;
    } else if (onboardingFinishedCnt >= UserService.limitOnboardingFinishCnt) {
      console.log('2');
      user.waitingOrder = UserService.startWaitingOrder;
      user.onboardingStep = OnboardingStepEnum.WAITING;
    } else {
      user.onboardingStep = OnboardingStepEnum.FINISHED;
    }
    await user.save();
  }

  async updateNickname(user: UserEntity, nickname: string): Promise<void> {
    const sameNickUser = await this.userRepository.findOneBy({
      nickname: nickname,
    });
    if (sameNickUser) {
      throw new HttpException('똑같은 닉네임의 유저가 있음', HttpStatus.FOUND);
    }
    user.nickname = nickname;
    await user.save();
    return;
  }

  async updateIntroduce(user: UserEntity, introduce: string): Promise<void> {
    user.introduce = introduce;
    await user.save();
  }

  async updateLinks(user: UserEntity, links: string[]): Promise<void> {
    user.links = JSON.stringify(links);
    await user.save();
  }

  async getMe(user: UserEntity): Promise<UserResponseDto> {
    const links = JSON.parse(user.links);
    const followerCnt = await this.userFollowService.getUserFollowerCnt(
      user.nickname,
    );
    const rankOfView = await this.getUserRankOfView(user);
    return plainToClass(UserResponseDto, {
      ...user,
      links,
      followerCnt,
      rankOfView,
    });
  }

  async getOtherUser(
    me: UserEntity | null,
    userId: string,
  ): Promise<UserResponseDto> {
    const user = await this.userRepository.findOneBy({ id: userId });
    if (!user) throw new NotFoundException();
    const followerCnt = await this.userFollowService.getUserFollowerCnt(
      user.nickname,
    );
    const links = JSON.parse(user.links);
    let isFollower = false;
    if (me) {
      isFollower = await this.userFollowService.isFollower(me, userId);
    }
    const rankOfView = await this.getUserRankOfView(user);
    return plainToClass(UserResponseDto, {
      ...user,
      rankOfView,
      followerCnt,
      isFollower,
      links,
    });
  }

  async updateTodayView(me: UserEntity, userId: string): Promise<void> {
    if (me.id === userId) return;
    const user = await this.userRepository.findOneBy({
      id: userId,
    });
    if (!user) throw new NotFoundException();
    user.view.todayCnt++;
    await user.save();
  }

  async updateCardImgUrl(user: UserEntity, cardImgUrl: string): Promise<void> {
    user.cardImgUrl = cardImgUrl;
    await user.save();
  }

  async deleteUser(user: UserEntity): Promise<void> {
    await user.remove();
  }

  private async getUserRankOfView(user: UserEntity): Promise<number> {
    const rank = await this.userRepository.countBy({
      onboardingStep: OnboardingStepEnum.FINISHED,
      view: {
        totalCnt: MoreThanOrEqual(user.view.totalCnt),
        todayCnt: MoreThanOrEqual(user.view.todayCnt),
      },
    });
    return rank;
  }
}
