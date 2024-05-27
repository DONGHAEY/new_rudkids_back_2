import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import JwtAuthGuard from 'src/auth/guards/auth.guard';
import { ShippingService } from './shipping.service';
import { GetUser } from 'src/auth/decorators/getUser.decorator';
import { UserEntity } from 'src/user/entity/user.entity';
import { AddEditShippingRequestDto } from './dto/addEdit-shipping-request.dto';
import axios from 'axios';

@Controller('shipping')
@UseGuards(JwtAuthGuard)
export class ShippingController {
  constructor(private shippingService: ShippingService) {}

  @Get()
  async getMyShippingList(@GetUser() user: UserEntity) {
    return await this.shippingService.getShippingList(user);
  }

  @Post()
  async addMyShpping(
    @GetUser() user: UserEntity,
    @Body() shippingRequestDto: AddEditShippingRequestDto,
  ) {
    return await this.shippingService.addShipping(user, shippingRequestDto);
  }

  @Put('/:shipping_id')
  async editMyShipping(
    @Param('shipping_id') shippingId: string,
    @Body() shippingRequestDto: AddEditShippingRequestDto,
  ) {
    return await this.shippingService.editShipping(
      shippingId,
      shippingRequestDto,
    );
  }

  @Delete('/:shipping_id')
  async deleteMyShipping(@Param('shipping_id') shippingId: string) {
    return await this.shippingService.removeShipping(shippingId);
  }

  @Get('/searchAddress')
  async searchAddress(@Query('query') query: string) {
    //
    return axios
      .get(
        `https://naveropenapi.apigw.ntruss.com/map-geocode/v2/geocode?query=${query}&count=50&page=1`,
        {
          headers: {
            ['X-NCP-APIGW-API-KEY-ID']: process.env['NAVER_API_ID'],
            ['X-NCP-APIGW-API-KEY']: process.env['NAVER_API_KEY'],
          },
        },
      )
      .then((res) => res.data?.addresses ?? []);
  }
}
