import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { SchoolEntity } from './entity/school.entity';
import { Repository } from 'typeorm';
import { CreateSchoolDto } from './dto/create-school.dto';

@Injectable()
export class SchoolService {
  constructor(
    @InjectRepository(SchoolEntity)
    private schoolRepository: Repository<SchoolEntity>,
  ) {}

  async getSchool(schoolName: string): Promise<SchoolEntity> {
    const school = await this.schoolRepository.findOne({
      where: {
        name: schoolName,
      },
    });
    if (!school) throw new NotFoundException();
    return school;
  }

  async createSchool(createSchoolDto: CreateSchoolDto): Promise<void> {
    if (
      await this.schoolRepository.findOneBy({
        name: createSchoolDto.name,
      })
    ) {
      throw new HttpException('이미 존재하는 학교이름', HttpStatus.FOUND);
    }
    await this.schoolRepository
      .create({
        ...createSchoolDto,
      })
      .save();
  }

  async deleteSchool(schooolName: string): Promise<void> {
    const school = await this.schoolRepository.findOneBy({
      name: schooolName,
    });
    if (!school) {
      throw new NotFoundException();
    }
    await school.remove();
  }
}
