import {
  Column,
  Entity,
  Generated,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
} from 'typeorm';
import { OrderProductEntity } from './order-product.entity';

@Entity('order-product-option')
export class ProductOptionEntity {
  @PrimaryColumn()
  @Generated('uuid')
  id: string;

  @Column()
  groupName: string;

  @Column()
  name: string;

  @Column()
  price: number;

  @ManyToOne(() => OrderProductEntity, (orderProduct) => orderProduct.options, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn()
  orderProduct: OrderProductEntity;
}
