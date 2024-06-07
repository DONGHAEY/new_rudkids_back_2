import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { OrderEntity } from 'src/order/entity/order.entity';
import { OrderProductEntity } from 'src/order/entity/order-product.entity';
import { PaymentEntity } from 'src/payment/entity/payment.entity';

@Injectable()
export class CollectionService {
  constructor(private dataSource: DataSource) {}

  async getQueryBasedCollection(userId: string): Promise<OrderProductEntity[]> {
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
}
