import { UserEntity } from 'src/user/entity/user.entity';
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  Generated,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryColumn,
} from 'typeorm';
import { ShippingEmbeded } from './embeded/shippping.embeded';
import { OrderProductEntity } from './order-product.entity';
import { PaymentEntity } from '../../payment/entity/payment.entity';
import { PriceEmbeded } from './embeded/price.embeded';

@Entity('order') //주문
export class OrderEntity extends BaseEntity {
  @PrimaryColumn()
  @Generated('uuid')
  id: string;

  @ManyToOne((type) => UserEntity, {
    onDelete: 'SET NULL',
    onUpdate: 'CASCADE',
  })
  @JoinColumn()
  orderer: UserEntity; //주문자

  @Column((type) => ShippingEmbeded)
  shipping: ShippingEmbeded; //배송정보

  @Column(() => PriceEmbeded)
  price: PriceEmbeded; //가격정보

  @Column()
  totalPrice: number;

  @OneToMany(
    () => OrderProductEntity,
    (orderProductEntity) => orderProductEntity.order,
  )
  @JoinColumn()
  orderProducts: OrderProductEntity[]; //주문상품정보

  // @Column({
  //   default: true,
  // })
  // needToPay: boolean;

  @OneToOne((type) => PaymentEntity, (paymentEntity) => paymentEntity.order, {
    onDelete: 'SET NULL',
    onUpdate: 'CASCADE',
  })
  @JoinColumn()
  payment: PaymentEntity; //결제정보

  @CreateDateColumn()
  createdAt: Date; //주문생성 DATE
}
