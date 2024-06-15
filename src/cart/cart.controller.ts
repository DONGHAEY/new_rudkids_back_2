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
import { PutCartprodQuantityDto } from './dto/request/put-cartprod-amount.dto';
import { AddToCartDto } from './dto/request/add-to-cart.dto';
import { OptionalJwtAuthGuard } from 'src/auth/guards/optional-auth.guard';

@Controller('cart')
export class CartController {
  constructor(private cartService: CartService) {}

  @Get('')
  @UseGuards(JwtAuthGuard)
  async getMyCart(@GetUser() user: UserEntity) {
    return await this.cartService.getCart(user);
  }

  @Get('/cart_products_cnt')
  @UseGuards(OptionalJwtAuthGuard)
  async getMyCartProductCnt(@GetUser() user: UserEntity) {
    return await this.cartService.getCartProductCnt(user);
  }

  @Post('cart_product')
  @UseGuards(JwtAuthGuard)
  async addProductToCart(
    @GetUser() user: UserEntity,
    @Body() addToCartRequestDto: AddToCartDto,
  ) {
    return await this.cartService.addProductToCart(user, addToCartRequestDto);
  }

  @Patch('/cart_product/:cart_product_id/quantity')
  @UseGuards(JwtAuthGuard)
  async patchCartprodAmount(
    @Param('cart_product_id') cartProdId: string,
    @Body() putCartprodQuantityDto: PutCartprodQuantityDto,
  ) {
    return await this.cartService.patchCartprodAmount(
      cartProdId,
      putCartprodQuantityDto,
    );
  }

  @Delete('/cart_product/:cart_product_id')
  @UseGuards(JwtAuthGuard)
  async deleteCartprod(@Param('cart_product_id') cartProdId: string) {
    return await this.cartService.deleteCartproduct(cartProdId);
  }

  @Delete()
  @UseGuards(JwtAuthGuard)
  async deleteCart(@GetUser() user: UserEntity) {
    return await this.cartService.deleteCart(user);
  }

  @Patch('/shipping_price')
  @UseGuards(JwtAuthGuard)
  async patchShippingPrice(
    @GetUser() user: UserEntity,
    @Body('data', ParseIntPipe) shippingPrice: number,
  ) {
    return await this.cartService.patchShippingPrice(user, shippingPrice);
  }
}
