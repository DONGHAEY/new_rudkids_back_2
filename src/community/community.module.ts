import { Module } from '@nestjs/common';
import { CommunityController } from './community.controller';
import { CommunityService } from './community.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CommunityEntity } from './entity/community.entity';

@Module({
  imports: [TypeOrmModule.forFeature([CommunityEntity])],
  controllers: [CommunityController],
  providers: [CommunityService],
})
export class CommunityModule {}
