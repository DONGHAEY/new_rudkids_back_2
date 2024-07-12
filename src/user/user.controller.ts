import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseArrayPipe,
  Patch,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { GetUser } from 'src/auth/decorator/getUser.decorator';
import { UserEntity } from './entity/user.entity';
import JwtAuthGuard from 'src/auth/guard/auth.guard';
import { UserService } from './user.service';
import { EditNicknameDto } from './dto/request/edit-nickname.dto';
import { FileService } from 'src/file/file.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { OptionalJwtAuthGuard } from 'src/auth/guard/optional-auth.guard';

@Controller('user')
export class UserController {
  constructor(
    private userService: UserService,
    private fileService: FileService,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Get('/my')
  async getMyUser(@GetUser() user: UserEntity) {
    return await this.userService.getMe(user);
  }

  @Get('/ranks-of-view')
  async getRankOfViewUsers() {
    return await this.userService.getViewRankUsers();
  }

  @UseGuards(OptionalJwtAuthGuard)
  @Get('/:user_id')
  async getOtherUser(
    @GetUser() user: UserEntity,
    @Param('user_id') userId: string,
  ) {
    return await this.userService.getOtherUser(user, userId);
  }

  @Patch('instagram')
  @UseGuards(JwtAuthGuard)
  async updateInstagramId(
    @GetUser() user: UserEntity,
    @Body() setInstagramDto: any,
  ) {
    await this.userService.setInstgram(user, setInstagramDto);
    return await this.userService.requestFinishOnboarding(user);
  }

  @Post(':user_id/today_view_up')
  @UseGuards(OptionalJwtAuthGuard)
  async updateTodayView(
    @GetUser() me: UserEntity,
    @Param('user_id') userId: string,
  ) {
    return await this.userService.updateTodayView(me, userId);
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

  @Delete()
  @UseGuards(JwtAuthGuard)
  async deleteUser(@GetUser() user: UserEntity) {
    await this.userService.deleteUser(user);
  }
}
