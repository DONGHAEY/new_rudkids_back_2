import { Module } from '@nestjs/common';
import { SeasonController } from './season.controller';
import { SeasonService } from './season.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SeasonEntity } from './entity/season.entity';

@Module({
  imports: [TypeOrmModule.forFeature([SeasonEntity])],
  controllers: [SeasonController],
  providers: [SeasonService],
  exports: [TypeOrmModule],
})
export class SeasonModule {}
