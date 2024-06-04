import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { OrderEntity } from './order.entity';
import { ProductOptionEntity } from './option.entity';

@Entity('order-product')
export class OrderProductEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    nullable: false,
  })
  name: string;

  @Column({
    nullable: false,
  })
  price: number;

  @Column({
    type: 'longtext',
  })
  previewImageUrl: string;

  @Column({
    default: 1,
  })
  quantity: number;

  @Column({
    nullable: false,
  })
  productId: string;

  @OneToMany(
    () => ProductOptionEntity,
    (productOption) => productOption.orderProduct,
    { eager: true },
  )
  @JoinColumn()
  options: ProductOptionEntity[];

  @ManyToOne(
    (type) => OrderEntity,
    (orderEntity) => orderEntity.orderProducts,
    {
      lazy: true,
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    },
  )
  @JoinColumn()
  order: OrderEntity | Promise<OrderEntity>;
}
