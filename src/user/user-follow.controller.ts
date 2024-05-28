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

@Controller('/user/:nickname/follow')
export class UserFollowController {
  constructor(private userFollowService: UserFollowService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  async followUser(
    @GetUser() user: UserEntity,
    @Param('nickname') nickname: string,
  ) {
    console.log('nickname', nickname);
    return await this.userFollowService.followUser(user, nickname);
  }

  @Delete()
  @UseGuards(JwtAuthGuard)
  async unFollowUser(
    @GetUser() user: UserEntity,
    @Param('nickname') nickname: string,
  ) {
    return await this.userFollowService.unFollowUser(user, nickname);
  }

  @Get('/status')
  async getFollowStatus(
    @GetUser() user: UserEntity,
    @Param('nickname') nickname: string,
  ) {
    return await this.userFollowService.isFollower(user, nickname);
  }
}
