import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { GetUser } from 'src/auth/decorators/getUser.decorator';
import JwtAuthGuard from 'src/auth/guards/auth.guard';
import { UserEntity } from 'src/user/entity/user.entity';
import { CartService } from './cart.service';
import { PutCartprodQuantityDto } from './dto/put-cartprod-amount.dto';

@Controller('cart')
@UseGuards(JwtAuthGuard)
export class CartController {
  constructor(private cartService: CartService) {}

  @Get('')
  async getMyCart(@GetUser() user: UserEntity) {
    return await this.cartService.getCart(user);
  }

  @Get('/cart_products_cnt')
  async getMyCartProductCnt(@GetUser() user: UserEntity) {
    return await this.cartService.getCartProductCnt(user);
  }

  @Post('cart_product')
  async addProductToCart(
    @GetUser() user: UserEntity,
    @Body('productId', ParseIntPipe) productId: number,
  ) {
    return await this.cartService.addProductToCart(user, productId);
  }

  @Patch('/cart_product/:product_id/quantity')
  async patchCartprodAmount(
    @GetUser() user: UserEntity,
    @Param('product_id', ParseIntPipe) productId: number,
    @Body() putCartprodQuantityDto: PutCartprodQuantityDto,
  ) {
    return await this.cartService.patchCartprodAmount(
      user,
      productId,
      putCartprodQuantityDto,
    );
  }

  @Delete('/cart_product/:product_id')
  async deleteCartprod(
    @GetUser() user: UserEntity,
    @Param('product_id', ParseIntPipe) productId: number,
  ) {
    return await this.cartService.deleteCartproduct(user, productId);
  }

  @Delete()
  async deleteCart(@GetUser() user: UserEntity) {
    return await this.cartService.deleteCart(user);
  }

  @Patch('/shipping_price')
  async patchShippingPrice(
    @GetUser() user: UserEntity,
    @Body('data', ParseIntPipe) shippingPrice: number,
  ) {
    return await this.cartService.patchShippingPrice(user, shippingPrice);
  }
}
