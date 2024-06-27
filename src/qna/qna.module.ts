import { Module } from '@nestjs/common';
import { QnaController } from './qna.controller';
import { QnaService } from './qna.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { QnaEntity } from './entity/qna.entity';

@Module({
  imports: [TypeOrmModule.forFeature([QnaEntity])],
  controllers: [QnaController],
  providers: [QnaService],
})
export class QnaModule {}
