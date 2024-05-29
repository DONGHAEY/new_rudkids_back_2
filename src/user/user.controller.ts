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

  @UseGuards(JwtAuthGuard)
  @Get('/:nickname')
  async getOtherUser(@Param('nickname') nickName: string) {
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

  @Post(':nickname/today_view_up')
  async updateTodayView(@Param('nickname') nickname: string) {
    return await this.userService.updateTodayView(nickname);
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
    console.log(file, '--');
    const uploadedFile = await this.fileService.saveFileToSupabase(
      `${user.id}-card.svg`,
      file.buffer,
    );
    return await this.userService.updateCardImgUrl(user, uploadedFile);
    //
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
