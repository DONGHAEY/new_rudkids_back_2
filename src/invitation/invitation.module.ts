import { Module } from '@nestjs/common';
import { InvitationController } from './invitation.controller';
import { InvitationService } from './invitation.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InvitationEntity } from './entity/invitation.entity';
import { UserEntity } from 'src/user/entity/user.entity';
import { SchoolEntity } from 'src/school/entity/school.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([InvitationEntity, UserEntity, SchoolEntity]),
  ],
  controllers: [InvitationController],
  providers: [InvitationService],
  exports: [TypeOrmModule],
})
export class InvitationModule {}
