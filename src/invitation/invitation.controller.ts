import {
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { GetUser } from 'src/auth/decorators/getUser.decorator';
import JwtAuthGuard from 'src/auth/guards/auth.guard';
import { UserEntity } from 'src/user/entity/user.entity';
import { InvitationService } from './invitation.service';

@Controller('invitation')
export class InvitationController {
  //
  constructor(private invitationService: InvitationService) {}

  @Post('/friend')
  @UseGuards(JwtAuthGuard)
  async createInvitation(@GetUser() user: UserEntity) {
    console.log('create-invitation');
    return await this.invitationService.createFriendInvitation(user);
  }

  @Post('/school/:schoolNm')
  async createSchoolInvitation(@Param('schoolNm') schoolNm: string) {
    return await this.invitationService.createSchoolInvitation(schoolNm);
  }

  @Get('/:invitation_id')
  async findInvitation(@Param('invitation_id') invitationId: string) {
    return await this.invitationService.findInvitation(invitationId);
  }

  @Post('/:invitation_id/accept')
  @UseGuards(JwtAuthGuard)
  async acceptInvitation(
    @Param('invitation_id') invitationId: string,
    @GetUser() user: UserEntity,
  ) {
    return await this.invitationService.acceptInvitation(invitationId, user);
  }

  @Delete('/:invitation_id')
  @UseGuards(JwtAuthGuard)
  async deleteInvitation(
    @Param('invitation_id') invitationId: string,
    @GetUser() user: UserEntity,
  ) {
    return await this.invitationService.deleteInvitation(user, invitationId);
  }
}
