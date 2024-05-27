import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { SeasonEntity } from './entity/season.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateEditSeasonRequestDto } from './dto/create-edit-season-request.dto';

@Injectable()
export class SeasonService {
  constructor(
    @InjectRepository(SeasonEntity)
    private seasonRepository: Repository<SeasonEntity>,
  ) {}

  async getSeason(seasonName: string) {
    const season = await this.seasonRepository.findOneBy({
      name: seasonName,
    });
    return season;
  }

  async createSeason(createSeasonDto: CreateEditSeasonRequestDto) {
    const sameNameSeason = await this.seasonRepository.findOneBy({
      name: createSeasonDto.name,
    });
    if (sameNameSeason) {
      throw new HttpException('이미 존재하는 시즌네임입니다', HttpStatus.FOUND);
    }
    return await this.seasonRepository
      .create({
        ...createSeasonDto,
      })
      .save();
  }

  async editSeason(
    seasonName: string,
    editSeasonDto: CreateEditSeasonRequestDto,
  ) {
    const season = await this.seasonRepository.findOneBy({
      name: seasonName,
    });
    if (!season) throw new NotFoundException();
    const sameNameSeason = await this.seasonRepository.findOneBy({
      name: editSeasonDto.name,
    });
    if (sameNameSeason) {
      throw new HttpException('이미 존재하는 시즌네임입니다', HttpStatus.FOUND);
    }
    await this.seasonRepository.update(
      {
        name: seasonName,
      },
      {
        ...editSeasonDto,
      },
    );
  }

  async deleteSeason(seasonName: string) {
    const season = await this.seasonRepository.findOneBy({
      name: seasonName,
    });
    if (!season) throw new NotFoundException();
    await season.remove();
    return;
  }
}
