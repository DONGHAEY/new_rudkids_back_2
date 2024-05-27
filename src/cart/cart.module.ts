import { Module } from '@nestjs/common';
import { CartService } from './cart.service';
import { CartController } from './cart.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CartEntity } from './entity/cart.entity';
import { CartProductEntity } from './entity/cart-product.entity';
import { ProductEntity } from 'src/product/entity/product.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([CartEntity, ProductEntity, CartProductEntity]),
  ],
  providers: [CartService],
  controllers: [CartController],
  exports: [TypeOrmModule],
})
export class CartModule {}
