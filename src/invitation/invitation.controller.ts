import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { GetUser } from 'src/auth/decorator/getUser.decorator';
import JwtAuthGuard from 'src/auth/guard/auth.guard';
import { UserEntity } from 'src/user/entity/user.entity';
import { InvitationService } from './invitation.service';
import { CreateCommunityInvitationDto } from './dto/request/create-community-invitation.dto';

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

  @Post('/community/:community_name')
  async createCommunityInvitation(
    @Param('community_name') communityName: string,
    @Body() createCommunityInvitationDto: CreateCommunityInvitationDto,
  ) {
    return await this.invitationService.createCommunityInvitation(
      communityName,
      createCommunityInvitationDto,
    );
  }

  @Get('/:invitation_id')
  async getInvitation(@Param('invitation_id') invitationId: string) {
    return await this.invitationService.getInvitation(invitationId);
  }

  @Get('/:invitation_id/mark_users')
  async getMarkUsers(@Param('invitation_id') invitationId: string) {
    return await this.invitationService.getMarkUsers(invitationId);
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
