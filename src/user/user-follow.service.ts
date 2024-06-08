import { Injectable, NotFoundException } from '@nestjs/common';
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

  async toggleFollow(me: UserEntity, targetUserId: string) {
    let myFollow = await this.userFollowRepository.findOneBy({
      targetUser: {
        id: targetUserId,
      },
      follower: {
        id: me.id,
      },
    });
    //
    if (myFollow) {
      await myFollow.remove();
    } else {
      await this.followUser(me, targetUserId);
    }
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

  private async followUser(
    user: UserEntity,
    targetUserId: string,
  ): Promise<void> {
    const targetUser = await this.userRepository.findOneBy({
      id: targetUserId,
    });
    if (!targetUser) throw new NotFoundException();
    const newFollow = new UserFollowEntity();
    newFollow.targetUser = targetUser;
    newFollow.follower = user;
    await newFollow.save();
  }
}
