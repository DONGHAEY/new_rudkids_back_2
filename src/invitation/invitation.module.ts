import { Module } from '@nestjs/common';
import { InvitationController } from './invitation.controller';
import { InvitationService } from './invitation.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InvitationEntity } from './entity/invitation.entity';
import { UserEntity } from 'src/user/entity/user.entity';
import { CommunityEntity } from 'src/community/entity/community.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([InvitationEntity, CommunityEntity, UserEntity]),
  ],
  controllers: [InvitationController],
  providers: [InvitationService],
  exports: [TypeOrmModule],
})
export class InvitationModule {}
