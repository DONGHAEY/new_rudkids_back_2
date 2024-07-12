import { Body, Controller, Post } from '@nestjs/common';
import { CreateCommunityDto } from './dto/request/create-community.dto';
import { CommunityService } from './community.service';

@Controller('community')
export class CommunityController {
  constructor(private communityService: CommunityService) {}

  @Post()
  async createCommunity(@Body() createCommunityDto: CreateCommunityDto) {
    return await this.communityService.createCommunity(createCommunityDto);
  }
}
