import {
  Body,
  Controller,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import JwtAuthGuard from 'src/auth/guards/auth.guard';
import { FileService } from './file.service';
import { Blob } from 'buffer';
import * as bufferToArrayBuffer from 'buffer-to-arraybuffer';

@Controller('file')
export class FileController {
  constructor(private fileService: FileService) {}

  @Post('/upload')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('file'))
  async upload(
    @UploadedFile('file') file: Express.Multer.File,
    @Body('path') path: string,
  ) {
    const arrayBuffer = bufferToArrayBuffer(file.buffer);
    const blob = new Blob([arrayBuffer], {
      type: file.mimetype,
    });
    return await this.fileService.saveFileToSupabase(path, blob);
  }
}
