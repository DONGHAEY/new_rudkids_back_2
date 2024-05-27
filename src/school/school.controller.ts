import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { SchoolService } from './school.service';
import { CreateSchoolDto } from './dto/create-school.dto';
import JwtAuthGuard from 'src/auth/guards/auth.guard';
import AdminCheckGuard from 'src/auth/guards/admin-check.guard';
import { CheckAdmin } from 'src/auth/decorators/checkAdmin.decorator';

@Controller('school')
export class SchoolController {
  constructor(private schoolService: SchoolService) {}

  @Get('/:school_name')
  async getSchool(@Param('school_name') schoolName: string) {
    return await this.schoolService.getSchool(schoolName);
  }

  @Post()
  @UseGuards(JwtAuthGuard, AdminCheckGuard)
  @CheckAdmin()
  async createSchool(@Body() createSchoolDto: CreateSchoolDto) {
    return await this.schoolService.createSchool(createSchoolDto);
  }

  @Delete('/:school_name')
  @UseGuards(JwtAuthGuard, AdminCheckGuard)
  @CheckAdmin()
  async deleteSchool(@Param('school_name') schoolName: string) {
    return await this.schoolService.deleteSchool(schoolName);
  }
}
