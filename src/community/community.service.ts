import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateCommunityDto } from './dto/request/create-community.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { CommunityEntity } from './entity/community.entity';
import { Repository } from 'typeorm';

@Injectable()
export class CommunityService {
  constructor(
    @InjectRepository(CommunityEntity)
    private communityRepository: Repository<CommunityEntity>,
  ) {}

  async createCommunity(createCommunityDto: CreateCommunityDto): Promise<void> {
    const sameNameCommunity = await this.communityRepository.findOneBy({
      name: createCommunityDto.name,
    });
    if (sameNameCommunity) {
      throw new HttpException(
        '같은 이름으로 이미 커뮤니티가 존재함',
        HttpStatus.FOUND,
      );
    }

    const newCommunity = new CommunityEntity();
    newCommunity.name = createCommunityDto.name;
    newCommunity.imageUrl = createCommunityDto.imageUrl;
    await newCommunity.save();
  }
}
