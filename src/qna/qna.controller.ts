import { Body, Controller, Post } from '@nestjs/common';
import { QnaService } from './qna.service';

@Controller('qna')
export class QnaController {
  constructor(private qnaService: QnaService) {}

  @Post()
  async addQna(@Body() addQnaDto: any) {
    await this.qnaService.addQna(addQnaDto);
  }
}
