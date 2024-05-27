import { Module } from '@nestjs/common';
import { InstagramProfileController } from './instagram-proflie.controller';
import { InstagramProfileService } from './instagram-profile.service';
import { FileService } from 'src/file/file.service';

@Module({
  controllers: [InstagramProfileController],
  providers: [InstagramProfileService, FileService],
})
export class InstagramProfileModule {}
