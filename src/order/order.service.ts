import {
  ConflictException,
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from 'src/user/entity/user.entity';
import { OrderEntity } from './entity/order.entity';
import { DataSource, LessThan, MoreThan, Repository } from 'typeorm';
import { OrderProductEntity } from './entity/order-product.entity';
import { CreateOrderDto } from './dto/request/create-order.dto';
import { PatchShippingDto } from './dto/request/patch-shipping.dto';
import { ProductOptionEntity as OrderProductOptionEntity } from './entity/order-product-option.entity';
import { CursorPageRequestDto } from 'src/dto/pagination/page-request.dto';
import { CursorPageMeta } from 'src/dto/pagination/page-meta.dto';
import { PageResponseDto } from 'src/dto/pagination/page-response.dto';
import PayStatusEnum from 'src/payment/enum/pay-status.enum';
import { ProductEntity } from 'src/product/entity/product.entity';
import { OrderingProductDto } from './dto/request/ordering-product.dto';

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
      const newOrder = new OrderEntity();
      newOrder.orderer = user; //주문자
      newOrder.shipping = createOrderDto.shipping; //배송정보
      newOrder.price = {
        shipping: 1,
        orderProducts: 0,
      };
      newOrder.orderProducts = [];
      console.log(createOrderDto.orderingProducts);
      await Promise.all(
        createOrderDto.orderingProducts.map(
          async (orderingProduct: OrderingProductDto) => {
            const product = await manager.findOne(ProductEntity, {
              where: {
                id: orderingProduct.productId,
              },
              relations: {
                optionGroups: {
                  options: true,
                },
              },
            });
            if (!product) throw new NotFoundException();
            if (
              product.optionGroups.length !== orderingProduct.optionIds.length
            ) {
              throw new ConflictException('옵션개수가 제품의 개수와 맞지 않음');
            }
            const newOrderProduct = new OrderProductEntity();
            newOrderProduct.name = product.name;
            newOrderProduct.price = product.price;
            newOrderProduct.thumnail = product.thumnail;
            newOrderProduct.quantity = orderingProduct.quantity;
            newOrderProduct.productId = product.id;
            await Promise.all(
              product.optionGroups?.map(async (productOptionGroup) => {
                const findOption = productOptionGroup.options?.find(
                  (productOption) => {
                    return orderingProduct.optionIds.find(
                      (optionId) => productOption.id === optionId,
                    );
                  },
                );
                if (!findOption) {
                  throw new NotFoundException('옵션을 찾을 수 없습니다.');
                }
                const optionEm = new OrderProductOptionEntity();
                optionEm.groupName = productOptionGroup.name;
                optionEm.name = findOption.name;
                optionEm.price = findOption.price;
                newOrderProduct.price += findOption.price;
                return await manager.save(optionEm);
              }),
            );
            await manager.save(newOrderProduct);
            newOrder.orderProducts.push(newOrderProduct);
            newOrder.price.orderProducts +=
              newOrderProduct.price * orderingProduct.quantity;
          },
        ),
      );
      newOrder.totalPrice = Object.values(newOrder.price).reduce(
        (a, b) => a + b,
        0,
      );
      if (newOrder.totalPrice <= 0) newOrder.totalPrice = 1;
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

  async get1stOrderNth(user: UserEntity) {
    const count = await this.dataSource.transaction(async (manager) => {
      const order = await manager.findOneBy(OrderEntity, {
        payment: {
          status: PayStatusEnum.COMPLETED,
        },
        orderer: {
          id: user.id,
        },
      });
      if (!order) throw new NotFoundException();
      const count = await this.orderRepository.countBy({
        createdAt: MoreThan(order.createdAt),
      });
      return count;
    });
    return count + 1;
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
