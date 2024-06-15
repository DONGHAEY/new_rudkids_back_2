import {
  Body,
  Controller,
  Get,
  Param,
  ParseArrayPipe,
  Patch,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { GetUser } from 'src/auth/decorators/getUser.decorator';
import { UserEntity } from './entity/user.entity';
import JwtAuthGuard from 'src/auth/guards/auth.guard';
import { UserService } from './user.service';
import { EditNicknameDto } from './dto/editNickname.dto';
import { FileService } from 'src/file/file.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { OptionalJwtAuthGuard } from 'src/auth/guards/optional-auth.guard';

@Controller('user')
export class UserController {
  constructor(
    private userService: UserService,
    private fileService: FileService,
  ) {}

  @UseGuards(OptionalJwtAuthGuard)
  @Get('/my')
  async getMyUser(@GetUser() user: UserEntity) {
    if (!user) return null;
    return await this.userService.getMe(user);
  }

  @Get('/rank')
  async getRankUserList() {
    return await this.userService.getRankUserList();
  }

  @UseGuards(OptionalJwtAuthGuard)
  @Get('/:user_id')
  async getOtherUser(
    @GetUser() user: UserEntity,
    @Param('user_id') userId: string,
  ) {
    return await this.userService.getOtherUser(user, userId);
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

  @Post(':user_id/today_view_up')
  async updateTodayView(@Param('user_id') userId: string) {
    return await this.userService.updateTodayView(userId);
  }

  @Patch('nickname')
  @UseGuards(JwtAuthGuard)
  async updateNickname(
    @GetUser() user: UserEntity,
    @Body() editNicknameDto: EditNicknameDto,
  ) {
    return await this.userService.updateNickname(
      user,
      editNicknameDto.nickname,
    );
  }

  @Patch('cardImgUrl')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('file'))
  async updateCardImgUrl(
    @GetUser() user: UserEntity,
    @UploadedFile('file') file: Express.Multer.File,
  ) {
    const uploadedFile = await this.fileService.saveFileToSupabase(
      `/rudcards/${user.id}-rudcard`,
      file.buffer,
      file.mimetype,
    );
    return await this.userService.updateCardImgUrl(user, uploadedFile);
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

  @Patch('set-firstInviteFinished')
  @UseGuards(JwtAuthGuard)
  async setFirstInviteFinished(@GetUser() user: UserEntity) {
    return await this.userService.setFirstInviteFinished(user);
  }
}
