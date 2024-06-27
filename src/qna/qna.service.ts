import { Injectable } from '@nestjs/common';
import { QnaEntity } from './entity/qna.entity';

@Injectable()
export class QnaService {
  constructor() {}

  async addQna(addQnaDto: any) {
    const qna = new QnaEntity();
    qna.writer = { ...addQnaDto.writer };
    qna.attachment = addQnaDto.attachment ?? '?';
    qna.type = addQnaDto.type ?? '?';
    qna.subject = addQnaDto.subject;
    qna.message = addQnaDto.message;
    qna.responseMethod = addQnaDto.responseMethod;
    await qna.save();
  }
}
