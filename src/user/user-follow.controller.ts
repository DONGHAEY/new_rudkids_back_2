import {
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { UserFollowService } from './user-follow.service';
import JwtAuthGuard from 'src/auth/guards/auth.guard';
import { GetUser } from 'src/auth/decorators/getUser.decorator';
import { UserEntity } from 'src/user/entity/user.entity';

@Controller('/user/:target_user_id/follow')
export class UserFollowController {
  constructor(private userFollowService: UserFollowService) {}

  @Post('/toggle')
  @UseGuards(JwtAuthGuard)
  async toggleFollowUser(
    @GetUser() user: UserEntity,
    @Param('target_user_id') targetUserId: string,
  ) {
    return await this.userFollowService.toggleFollow(user, targetUserId);
  }

  @Get('/status')
  async getFollowStatus(
    @GetUser() user: UserEntity,
    @Param('target_user_id') targetUserId: string,
  ) {
    return await this.userFollowService.isFollower(user, targetUserId);
  }
}
