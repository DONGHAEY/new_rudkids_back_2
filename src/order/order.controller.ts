import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { CheckAdmin } from 'src/auth/decorators/checkAdmin.decorator';
import { GetUser } from 'src/auth/decorators/getUser.decorator';
import AdminCheckGuard from 'src/auth/guards/admin-check.guard';
import JwtAuthGuard from 'src/auth/guards/auth.guard';
import { UserEntity } from 'src/user/entity/user.entity';
import { OrderService } from './order.service';
import { CreateOrderRequestDto } from './dto/create-order-request.dto';
import { PatchShippingRequestDto } from './dto/patch-shipping-request.dto';

@Controller('order')
@UseGuards(JwtAuthGuard, AdminCheckGuard)
export class OrderController {
  constructor(private orderService: OrderService) {}

  @Get()
  async getMyOrders(@GetUser() user: UserEntity) {
    return await this.orderService.getUserOrders(user);
  }

  @Post()
  async createOrder(
    @GetUser() user: UserEntity,
    @Body() createOrderDto: CreateOrderRequestDto,
  ) {
    return await this.orderService.createOrder(user, createOrderDto);
  }

  @Patch('/:order_id/shipping')
  async patchShippingInfo(
    @Param('order_id') orderId: string,
    @Body() patchShippingRequestDto: PatchShippingRequestDto,
  ) {
    //배송지를 수정할 수 있을것
    return await this.orderService.patchShippingInfo(
      orderId,
      patchShippingRequestDto,
    );
  }

  @Get('/:order_id')
  async getOrder(@Param('order_id') orderId: string) {
    return await this.orderService.getOrder(orderId);
  }

  /*** vvv Admin API vvv */
  // @Get()
  // @CheckAdmin()
  // async searchOrders(@Query() searchOrdersDto: any) {}

  @Patch('/:order_id/shipping/trackingNumber')
  @CheckAdmin()
  async patchOrder(
    @Param('order_id') orderId: number,
    @Body('trackingNumber') trackingNumber: any,
  ) {}
}
