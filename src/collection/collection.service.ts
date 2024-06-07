import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CollectedProduct } from './entity/collected-product.entity';
import { DataSource, Repository } from 'typeorm';
import { UserEntity } from 'src/user/entity/user.entity';
import { OffsetPageRequestDto } from 'src/dto/pagination/page-request.dto';
import { OffsetPageMetaDto } from 'src/dto/pagination/page-meta.dto';
import { PageResponseDto } from 'src/dto/pagination/page-response.dto';
import { CollectedProductDto } from './dto/response/collected-product.dto';
import { ProductEntity } from 'src/product/entity/product.entity';
import { OrderEntity } from 'src/order/entity/order.entity';
import { OrderProductEntity } from 'src/order/entity/order-product.entity';
import { PaymentEntity } from 'src/payment/entity/payment.entity';

@Injectable()
export class CollectionService {
  constructor(
    @InjectRepository(CollectedProduct)
    private collectedProductRepo: Repository<CollectedProduct>,
    private dataSource: DataSource,
  ) {}

  async getQueryBasedCollection(
    userId: string,
    offsetPageRequest: OffsetPageRequestDto,
  ): Promise<OrderProductEntity[]> {
    const orderProducts = await this.dataSource.transaction(async (manager) => {
      return await manager
        .createQueryBuilder(OrderProductEntity, 'OrderProduct')
        .innerJoin(OrderEntity, 'Order', 'Order.id = OrderProduct.orderId')
        .where('Order.ordererId = :ordererId', { ordererId: userId })
        .innerJoin(PaymentEntity, 'Payment', 'Order.id = Payment.orderId')
        .andWhere(`Payment.status = 'completed'`)
        .select('OrderProduct')
        .addSelect('Min(Order.createdAt)', 'CA')
        .groupBy('OrderProduct.productId')
        .orderBy('CA', 'ASC')
        // .skip(offsetPageRequest.skip)
        // .take(offsetPageRequest.take)
        .getMany();
    });

    return orderProducts;
  }

  async getMyCollection(
    user: UserEntity,
    offsetPageRequest: OffsetPageRequestDto,
  ): Promise<PageResponseDto<CollectedProductDto>> {
    const [collectedProducts, total] =
      await this.collectedProductRepo.findAndCount({
        where: {
          owner: {
            id: user.id,
          },
        },
        take: offsetPageRequest.take,
        skip: offsetPageRequest.skip,
        order: {
          createdAt: 'ASC',
        },
      });
    const offsetPageMeta = new OffsetPageMetaDto({
      total,
      offsetPageRequest,
    });

    return new PageResponseDto(
      collectedProducts.map(
        (colllectedProduct) =>
          new CollectedProductDto(
            colllectedProduct.product.id,
            colllectedProduct.product.name,
            colllectedProduct.product.thumnail,
          ),
      ),
      offsetPageMeta,
    );
  }

  async setMyCollection(user: UserEntity, product: ProductEntity) {
    const hasSame = await this.collectedProductRepo.findOneBy({
      owner: { id: user.id },
      product: { id: product.id },
    });
    if (hasSame) return;
    await this.collectedProductRepo
      .create({
        owner: user,
        product,
      })
      .save();
  }
}
