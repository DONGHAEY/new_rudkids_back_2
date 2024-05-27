import { Controller, Get, Param, Post } from '@nestjs/common';
import { InstagramProfileService } from './instagram-profile.service';

@Controller('instagram-profile')
export class InstagramProfileController {
  constructor(private instagramProfileService: InstagramProfileService) {}

  @Get('/:instagram_id/profile_img_url')
  async getProfileImgUrl(@Param('instagram_id') instagramId: string) {
    return await this.instagramProfileService.getProfileImgUrl(instagramId);
  }
}
