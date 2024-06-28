import {
  ConflictException,
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CartEntity } from './entity/cart.entity';
import { DataSource, In, Repository } from 'typeorm';
import { UserEntity } from 'src/user/entity/user.entity';
import { ProductEntity } from 'src/product/entity/product.entity';
import { CartProductEntity } from './entity/cart-product.entity';
import { PutCartprodQuantityDto } from './dto/request/put-cartprod-amount.dto';
import { AddToCartDto } from './dto/request/add-to-cart.dto';
import { ProductOptionEntity } from 'src/product/entity/option.entity';
import {
  CartProductDto,
  GetCartProductDto,
  SelectedOptionDto,
} from './dto/resposne/get-cart-product.dto';

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

  private async createCart(user: UserEntity) {
    const newCart = new CartEntity();
    newCart.user = user;
    newCart.cartProducts = [];
    await newCart.save();
    return newCart;
  }

  async getCart(user: UserEntity): Promise<GetCartProductDto> {
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
    let userCart = await this.cartRepository.findOne(findOneOption);
    if (!userCart) {
      await this.createCart(user);
      userCart = await this.cartRepository.findOne(findOneOption);
    }
    const cartResponseDto: GetCartProductDto = new GetCartProductDto();
    cartResponseDto.id = userCart.id;
    cartResponseDto.cartProducts = await Promise.all(
      userCart.cartProducts?.map(async (cartProduct) => {
        const cartProductResponseDto = new CartProductDto();
        cartProductResponseDto.id = cartProduct.id;
        cartProductResponseDto.productId = cartProduct.product.id;
        cartProductResponseDto.name = cartProduct.product.name;
        cartProductResponseDto.category = cartProduct.product.category;
        cartProductResponseDto.price = cartProduct.product.price;
        cartProductResponseDto.thumnail = cartProduct.product.thumnail;
        cartProductResponseDto.quantity = cartProduct.quantity;
        cartProductResponseDto.options = await Promise.all(
          cartProduct?.options.map(async (option: ProductOptionEntity) => {
            const selectedOptionDto = new SelectedOptionDto();
            selectedOptionDto.id = option.id;
            selectedOptionDto.groupName = (await option?.optionGroup).name;
            selectedOptionDto.name = option.name;
            selectedOptionDto.price = option.price;
            cartProductResponseDto.price += option.price;
            return selectedOptionDto;
          }),
        );
        return cartProductResponseDto;
      }),
    );

    return cartResponseDto;
  }

  async getUserCartProductCnt(user: UserEntity) {
    if (!user) return 0;
    const count = await this.cartProductRepository.countBy({
      cart: {
        user: {
          id: user.id,
        },
      },
    });
    return count;
  }

  async addProductToCart(
    user: UserEntity,
    addToCartRequestDto: AddToCartDto,
  ): Promise<void> {
    let cart = await this.cartRepository.findOneBy({
      user: {
        id: user.id,
      },
    });
    if (!cart) {
      cart = await this.createCart(user);
    }
    const product = await this.productRepository.findOne({
      where: { id: addToCartRequestDto.productId },
      relations: {
        optionGroups: true,
      },
    });
    if (!product) throw new NotFoundException('유효한 상품을 찾을 수 없습니다');
    let cartProducts = await this.cartProductRepository.findBy({
      cart: { id: cart.id },
      product: { id: product.id },
    });
    /***  */
    cartProducts?.map((cartProduct) => {
      let sameOptionCnt = 0;
      cartProduct.options?.map((option) => {
        if (addToCartRequestDto.optionIds?.includes(option.id)) {
          sameOptionCnt++;
        }
      });
      if (sameOptionCnt === cartProduct.options.length) {
        throw new ConflictException('이미 저장된 아이템');
      }
    });
    await this.dataSource.transaction(async (manager) => {
      const productOptions = await manager.findBy(ProductOptionEntity, {
        id: In([...addToCartRequestDto.optionIds]),
        optionGroup: {
          product: {
            id: product.id,
          },
        },
      });

      const productOptionGroups = product?.optionGroups;
      productOptionGroups?.map((productOptionGroup) => {
        const options = productOptionGroup.options;
        const isFinded = options.find((option_) => {
          return addToCartRequestDto.optionIds?.find(
            (optionId) => optionId === option_.id,
          );
        });
        if (!isFinded) {
          throw new HttpException(
            '옵션 그룹마다 하나의 옵션을 필요로함',
            HttpStatus.BAD_REQUEST,
          );
        }
      });
      //똑같은 옵션 그룹을 선택했는지 체크
      if (productOptions?.length !== productOptionGroups.length) {
        throw new HttpException(
          '옵션 개수가 올바르지 않음',
          HttpStatus.BAD_REQUEST,
        );
      }
      const newCartProduct = new CartProductEntity();
      newCartProduct.cart = cart;
      newCartProduct.product = product;
      newCartProduct.quantity = addToCartRequestDto.quantity ?? 1;
      newCartProduct.options = productOptions;
      await newCartProduct.save();
      cart.cartProducts.push(newCartProduct);
      await cart.save();
    });
  }

  async deleteCartproduct(id: string): Promise<void> {
    const cartProduct = await this.cartProductRepository.findOneBy({
      id,
    });
    if (!cartProduct) throw new NotFoundException();
    await cartProduct.remove();
  }

  async patchCartprodAmount(
    id: string,
    putCartprodAmountDto: PutCartprodQuantityDto,
  ): Promise<CartProductEntity> {
    const cartProduct = await this.cartProductRepository.findOneBy({
      id,
    });
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
}
