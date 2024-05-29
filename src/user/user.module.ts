import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './entity/user.entity';
import { CacheModule } from '@nestjs/cache-manager';
import { SmsService } from 'src/sms/sms.service';
import { UserFollowEntity } from './entity/user-follow.entity';
import { UserFollowService } from './user-follow.service';
import { UserFollowController } from './user-follow.controller';
import { FileService } from 'src/file/file.service';

@Module({
  imports: [
    CacheModule.register(),
    TypeOrmModule.forFeature([UserEntity, UserFollowEntity]),
  ],
  providers: [UserService, UserFollowService, SmsService, FileService],
  controllers: [UserController, UserFollowController],
  exports: [
    TypeOrmModule,
    UserService,
    UserFollowService,
    FileService,
    SmsService,
    CacheModule,
  ],
})
export class UserModule {}
