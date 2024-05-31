import { Injectable, NotFoundException } from '@nestjs/common';
import { ApifyClient } from 'apify-client';
import axios from 'axios';
import { FileService } from 'src/file/file.service';

@Injectable()
export class InstagramProfileService {
  private static apifyClient = null;

  constructor(private fileService: FileService) {
    InstagramProfileService.apifyClient = new ApifyClient({
      token: process.env.APIFY_KEY,
    });
  }

  async getProfileImgUrl(instagramId: string) {
    const run = await InstagramProfileService.apifyClient
      .actor('apify/instagram-profile-scraper')
      .call({
        usernames: [instagramId],
      });

    const { items } = await InstagramProfileService.apifyClient
      .dataset(run.defaultDatasetId)
      .listItems();

    const instagramImgUrl = items[0]?.profilePicUrl;
    if (instagramImgUrl) {
      const imageFileResponse = await axios.get(instagramImgUrl, {
        responseType: 'arraybuffer',
      });
      const fileName = `${instagramId}-instagram.png`;
      const contentType =
        imageFileResponse?.headers?.['Content-Type']?.toString() ?? 'image/png';
      const savedInstagramImageUrl = await this.fileService.saveFileToSupabase(
        `/profile/${fileName}`,
        Buffer.from(imageFileResponse.data).buffer,
        contentType,
      );
      return savedInstagramImageUrl;
    }
    throw new NotFoundException();
  }
}
