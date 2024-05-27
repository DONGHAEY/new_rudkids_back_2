import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryColumn,
} from 'typeorm';
import PayStatusEnum from '../enum/pay-status.enum';
import { OrderEntity } from 'src/order/entity/order.entity';

@Entity('payment')
export class PaymentEntity extends BaseEntity {
  @PrimaryColumn()
  paymentKey: string;

  @Column()
  amount: number;

  @Column({
    default: PayStatusEnum.COMPLETED,
    type: 'enum',
    enum: PayStatusEnum,
  })
  status: PayStatusEnum;

  @CreateDateColumn()
  createdAt: Date;

  @OneToOne((type) => OrderEntity, (orderEntity) => orderEntity.payment, {
    lazy: true,
    onDelete: 'SET NULL',
    onUpdate: 'CASCADE',
  })
  @JoinColumn()
  order: OrderEntity | Promise<OrderEntity>;
}
