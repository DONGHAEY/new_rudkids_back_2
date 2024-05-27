import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CartEntity } from './entity/cart.entity';
import { DataSource, Repository } from 'typeorm';
import { UserEntity } from 'src/user/entity/user.entity';
import { ProductEntity } from 'src/product/entity/product.entity';
import { CartProductEntity } from './entity/cart-product.entity';
import { PutCartprodQuantityDto } from './dto/put-cartprod-amount.dto';

@Injectable()
export class CartService {
  constructor(
    @InjectRepository(CartEntity)
    private cartRepository: Repository<CartEntity>,
    @InjectRepository(CartProductEntity)
    private cartProductRepository: Repository<CartProductEntity>,
    @InjectRepository(ProductEntity)
    private productRepository: Repository<ProductEntity>,
    private dataSource: DataSource,
  ) {}

  async getCart(user: UserEntity): Promise<CartEntity> {
    const findOneOption: any = {
      where: {
        user: {
          id: user.id,
        },
      },
      order: {
        cartProducts: {
          createdAt: 'DESC',
        },
      },
    };
    //
    let userCart = await this.cartRepository.findOne(findOneOption);
    if (!userCart) {
      const newCart = new CartEntity();
      newCart.user = user;
      await newCart.save();
      userCart = await this.cartRepository.findOne(findOneOption);
    }
    return userCart;
  }

  async getCartProductCnt(user: UserEntity) {
    const count = await this.cartProductRepository.countBy({
      cart: {
        user: {
          id: user.id,
        },
      },
    });
    return count;
  }

  async addProductToCart(user: UserEntity, productId: number): Promise<void> {
    const cart = await this.getCart(user);
    if (!cart) throw new NotFoundException();
    const product = await this.productRepository.findOneBy({
      id: productId,
    });
    if (!product) throw new NotFoundException();
    let cartProduct = await this.getCartproduct(cart.id, product.id);
    if (cartProduct) {
      throw new ConflictException('이미 저장된 아이템');
    }
    await this.dataSource.transaction(async (manager) => {
      const newCartProduct = new CartProductEntity();
      newCartProduct.cart = cart;
      newCartProduct.product = product;
      newCartProduct.quantity = 1;
      await manager.save(newCartProduct);
      cart.cartProducts.push(cartProduct);
      await cart.save();
    });
  }

  private async getCartproduct(cartId: string, productId: number) {
    const cartProduct = await this.cartProductRepository.findOneBy({
      product: {
        id: productId,
      },
      cart: {
        id: cartId,
      },
    });
    return cartProduct;
  }

  async deleteCartproduct(user: UserEntity, productId: number): Promise<void> {
    const cart = await this.getCart(user);
    const cartProduct = await this.getCartproduct(cart.id, productId);
    if (!cartProduct) throw new NotFoundException();
    await cartProduct.remove();
  }

  async patchCartprodAmount(
    user: UserEntity,
    productId: number,
    putCartprodAmountDto: PutCartprodQuantityDto,
  ): Promise<CartProductEntity> {
    const cart = await this.getCart(user);
    const cartProduct = await this.getCartproduct(cart.id, productId);
    if (!cartProduct) throw new NotFoundException();
    cartProduct.quantity = putCartprodAmountDto.quantity;
    await cartProduct.save();
    return cartProduct;
  }

  async deleteCart(user: UserEntity): Promise<void> {
    await this.cartRepository.delete({
      user: {
        id: user.id,
      },
    });
  }

  async patchShippingPrice(
    user: UserEntity,
    shippingPrice: number,
  ): Promise<void> {
    const cart = await this.getCart(user);
    cart.shippingPrice = shippingPrice;
    await cart.save();
  }
}
