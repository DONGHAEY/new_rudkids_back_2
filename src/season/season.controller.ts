import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { CheckAdmin } from 'src/auth/decorators/checkAdmin.decorator';
import AdminCheckGuard from 'src/auth/guards/admin-check.guard';
import JwtAuthGuard from 'src/auth/guards/auth.guard';
import { SeasonService } from './season.service';
import { CreateEditSeasonRequestDto } from './dto/create-edit-season-request.dto';

@Controller('season')
export class SeasonController {
  constructor(private seasonService: SeasonService) {}

  @Get(':season_name')
  async getSeason(@Param('season_name') seasonName: string) {
    return await this.seasonService.getSeason(seasonName);
  }

  @UseGuards(JwtAuthGuard, AdminCheckGuard)
  @CheckAdmin()
  @Post()
  async createSeason(
    @Body() addEditShippingRequestDto: CreateEditSeasonRequestDto,
  ) {
    return await this.seasonService.createSeason(addEditShippingRequestDto);
  }

  @Put(':season_name')
  @UseGuards(JwtAuthGuard, AdminCheckGuard)
  @CheckAdmin()
  async editSeason(
    @Param('season_name') seasonName: string,
    @Body() edittShippingRequestDto: CreateEditSeasonRequestDto,
  ) {
    return await this.seasonService.editSeason(
      seasonName,
      edittShippingRequestDto,
    );
  }

  @Delete(':season_name')
  @UseGuards(JwtAuthGuard, AdminCheckGuard)
  @CheckAdmin()
  async deleteSeason(@Param('season_name') seasonName: string) {
    return await this.seasonService.deleteSeason(seasonName);
  }
}
