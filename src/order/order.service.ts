import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from 'src/user/entity/user.entity';
import { OrderEntity } from './entity/order.entity';
import { DataSource, Repository } from 'typeorm';
import { CartEntity } from 'src/cart/entity/cart.entity';
import { CartProductEntity } from 'src/cart/entity/cart-product.entity';
import { OrderProductEntity } from './entity/order-product.entity';
import { CreateOrderRequestDto } from './dto/create-order-request.dto';
import { PatchShippingRequestDto } from './dto/patch-shipping-request.dto';

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
    });
    if (!order) throw new NotFoundException();
    return order;
  }

  async createOrder(
    user: UserEntity,
    createOrderDto: CreateOrderRequestDto,
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
          newOrderProduct.previewImageUrl = cartProduct.product.imageUrl;
          newOrderProduct.quantity = cartProduct.quantity;
          newOrderProduct.productId = String(cartProduct.product.id);
          await manager.save(newOrderProduct);
          //
          newOrder.orderProducts.push(newOrderProduct);

          newOrder.price.orderProducts +=
            cartProduct.product.price * cartProduct.quantity;
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
    shippingDto: PatchShippingRequestDto,
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

  async getUserOrders(user: UserEntity): Promise<OrderEntity[]> {
    const orders = await this.orderRepository.find({
      where: {
        orderer: {
          id: user.id,
        },
      },
      order: {
        createdAt: 'DESC',
      },
    });
    return orders;
  }
}
