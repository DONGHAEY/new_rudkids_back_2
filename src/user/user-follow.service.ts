import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserFollowEntity } from './entity/user-follow.entity';
import { Repository } from 'typeorm';
import { UserEntity } from 'src/user/entity/user.entity';

@Injectable()
export class UserFollowService {
  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
    @InjectRepository(UserFollowEntity)
    private userFollowRepository: Repository<UserFollowEntity>,
  ) {}

  async getUserFollowerCnt(nickname: string): Promise<number> {
    const cnt = await this.userFollowRepository.countBy({
      targetUser: {
        nickname,
      },
    });
    return cnt;
  }

  async isFollower(me: UserEntity, targetUserId: string): Promise<boolean> {
    let myFollow = await this.userFollowRepository.findOneBy({
      targetUser: {
        id: targetUserId,
      },
      follower: {
        id: me.id,
      },
    });
    if (myFollow) {
      return true;
    }
    return false;
  }

  async followUser(user: UserEntity, targetUserId: string): Promise<void> {
    let myFollow = await this.userFollowRepository.findOneBy({
      targetUser: {
        id: targetUserId,
      },
      follower: {
        id: user.id,
      },
    });
    if (myFollow) {
      throw new HttpException('이미 팔로우가 되어있습니다.', HttpStatus.FOUND);
    }
    const targetUser = await this.userRepository.findOneBy({
      id: targetUserId,
    });
    if (!targetUser) throw new NotFoundException();
    const newFollow = new UserFollowEntity();
    newFollow.targetUser = targetUser;
    newFollow.follower = user;
    await newFollow.save();
  }

  async unFollowUser(user: UserEntity, targetUserId: string): Promise<void> {
    let myFollow = await this.userFollowRepository.findOneBy({
      targetUser: {
        id: targetUserId,
      },
      follower: {
        id: user.id,
      },
    });
    if (!myFollow)
      throw new NotFoundException('팔로우가 되어있지 않은 상태입니다');
    await myFollow.remove();
  }
}
