import { Module } from '@nestjs/common';
import { SchoolController } from './school.controller';
import { SchoolService } from './school.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SchoolEntity } from './entity/school.entity';
@Module({
  imports: [TypeOrmModule.forFeature([SchoolEntity])],
  controllers: [SchoolController],
  providers: [SchoolService],
  exports: [TypeOrmModule],
})
export class SchoolModule {}
