import {
  Body,
  Controller,
  Get,
  Param,
  ParseArrayPipe,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { GetUser } from 'src/auth/decorators/getUser.decorator';
import { UserEntity } from './entity/user.entity';
import JwtAuthGuard from 'src/auth/guards/auth.guard';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @UseGuards(JwtAuthGuard)
  @Get('/my')
  async getMyUser(@GetUser() user: UserEntity) {
    return await this.userService.getMe(user);
  }

  @UseGuards(JwtAuthGuard)
  @Get('/:nick_name')
  async getOtherUser(@Param('nick_name') nickName: string) {
    return await this.userService.getOtherUser(nickName);
  }

  @Patch('instagramId')
  @UseGuards(JwtAuthGuard)
  async updateInstagramId(
    @GetUser() user: UserEntity,
    @Body('instagramId') instagramId: string,
  ) {
    console.log('user instagramId', instagramId);
    return await this.userService.updateInstagramId(user, instagramId);
  }

  @Patch('imageUrl')
  @UseGuards(JwtAuthGuard)
  async updateImageUrl(
    @GetUser() user: UserEntity,
    @Body('imageUrl') imageUrl: string,
  ) {
    return await this.userService.updateImageUrl(user, imageUrl);
  }

  @Patch('nickname')
  @UseGuards(JwtAuthGuard)
  async updateNickname(
    @GetUser() user: UserEntity,
    @Body('nickname') nickname: string,
  ) {
    return await this.userService.updateNickname(user, nickname);
  }

  @Patch('introduce')
  @UseGuards(JwtAuthGuard)
  async updateIntroduce(
    @GetUser() user: UserEntity,
    @Body('introduce') introduce: string,
  ) {
    return await this.userService.updateIntroduce(user, introduce);
  }

  @Patch('links')
  @UseGuards(JwtAuthGuard)
  async updateLinks(
    @GetUser() user: UserEntity,
    @Body('links', ParseArrayPipe) links: string[],
  ) {
    return await this.userService.updateLinks(user, links);
  }
}
