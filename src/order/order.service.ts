import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from 'src/user/entity/user.entity';
import { OrderEntity } from './entity/order.entity';
import { DataSource, LessThan, Repository } from 'typeorm';
import { CartEntity } from 'src/cart/entity/cart.entity';
import { CartProductEntity } from 'src/cart/entity/cart-product.entity';
import { OrderProductEntity } from './entity/order-product.entity';
import { CreateOrderDto } from './dto/request/create-order.dto';
import { PatchShippingDto } from './dto/request/patch-shipping.dto';
import { ProductOptionEntity } from './entity/order-product-option.entity';
import { CursorPageRequestDto } from 'src/dto/pagination/page-request.dto';
import { CursorPageMeta } from 'src/dto/pagination/page-meta.dto';
import { PageResponseDto } from 'src/dto/pagination/page-response.dto';

@Injectable()
export class OrderService {
  //
  constructor(
    @InjectRepository(OrderEntity)
    private orderRepository: Repository<OrderEntity>,
    private dataSource: DataSource,
  ) {}

  async getOrder(orderId: string) {
    const order = await this.orderRepository.findOne({
      where: {
        id: orderId,
      },
      relations: {
        orderProducts: true,
        payment: true,
      },
    });
    if (!order) throw new NotFoundException();
    return order;
  }

  async createOrder(
    user: UserEntity,
    createOrderDto: CreateOrderDto,
  ): Promise<OrderEntity> {
    return this.dataSource.transaction(async (manager) => {
      const cart = await manager.findOne(CartEntity, {
        where: {
          id: createOrderDto.cartId,
        },
      });
      if (!cart) throw new NotFoundException('카트를 찾을 수 없습니다.');
      if (cart.cartProducts.length <= 0) {
        throw new HttpException('카트가 비었습니다.', HttpStatus.BAD_REQUEST);
      }
      const newOrder = new OrderEntity();
      newOrder.orderer = user; //주문자
      newOrder.shipping = createOrderDto.shipping; //배송정보
      newOrder.price = {
        shipping: 0,
        orderProducts: 0,
      };
      //배송 가격 관련
      newOrder.price.shipping = cart.shippingPrice;
      newOrder.orderProducts = [];
      await Promise.all(
        cart.cartProducts.map(async (cartProduct: CartProductEntity) => {
          const newOrderProduct = new OrderProductEntity();
          newOrderProduct.name = cartProduct.product.name;
          newOrderProduct.price = cartProduct.product.price;
          newOrderProduct.thumnail = cartProduct.product.thumnail;
          newOrderProduct.quantity = cartProduct.quantity;
          newOrderProduct.productId = String(cartProduct.product.id);
          newOrderProduct.options = await Promise.all(
            cartProduct.options?.map(async (option) => {
              const optionEm = new ProductOptionEntity();
              optionEm.groupName = (await option.optionGroup).name;
              optionEm.name = option.name;
              optionEm.price = option.price;
              newOrderProduct.price += option.price;
              return await manager.save(optionEm);
            }),
          );
          await manager.save(newOrderProduct);
          newOrder.orderProducts.push(newOrderProduct);
          newOrder.price.orderProducts +=
            newOrderProduct.price * cartProduct.quantity;
        }),
      );
      newOrder.totalPrice = Object.values(newOrder.price).reduce(
        (a, b) => a + b,
        0,
      );
      if (newOrder.totalPrice <= 0) {
        newOrder.totalPrice = 1;
      }
      return await manager.save(newOrder);
    });
  }

  async patchShippingInfo(
    orderId: string,
    shippingDto: PatchShippingDto,
  ): Promise<void> {
    const order = await this.orderRepository.findOne({
      where: {
        id: orderId,
      },
    });
    if (!order) throw new NotFoundException();
    if (order.shipping.trackingNumber) {
      throw new HttpException(
        '이미 배송을 시작했어요. 배송지 변경을 원하실 경우 고객센터로 문의하세요!',
        HttpStatus.BAD_REQUEST,
      );
    }
    order.shipping = shippingDto;
    await order.save();
  }

  async getUserOrders(
    user: UserEntity,
    cursorPageRequestDto: CursorPageRequestDto,
  ): Promise<PageResponseDto<any>> {
    //
    const cursorOrder = await this.orderRepository.findOneBy({
      id: cursorPageRequestDto.cursorId as string,
    });
    const [orders, total] = await this.orderRepository.findAndCount({
      where: {
        orderer: {
          id: user.id,
        },
        createdAt: cursorOrder ? LessThan(cursorOrder.createdAt) : undefined,
      },
      take: cursorPageRequestDto.take ?? 4,
      order: {
        createdAt: 'DESC',
      },
      relations: {
        orderProducts: true,
      },
    });
    const isLast = await this.orderRepository.countBy({
      orderer: {
        id: user.id,
      },
      createdAt: LessThan(orders[orders.length - 1]?.createdAt ?? null),
    });
    const cursorPageMeta = new CursorPageMeta({
      total,
      take: cursorPageRequestDto.take,
      cursor: orders[orders.length - 1]?.id as string,
      hasNextData: isLast ? true : false,
    });
    return new PageResponseDto(
      orders?.map((order) => {
        return {
          id: order.id,
          createdAt: order.createdAt,
          orderProducts: order.orderProducts,
        };
      }),
      cursorPageMeta,
    );
  }
}
