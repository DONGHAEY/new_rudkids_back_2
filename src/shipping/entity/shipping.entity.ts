import { UserEntity } from 'src/user/entity/user.entity';
import {
  BaseEntity,
  Column,
  Entity,
  Generated,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
} from 'typeorm';

@Entity('shipping')
export class ShippingEntity extends BaseEntity {
  @PrimaryColumn()
  @Generated('uuid')
  id: string;

  @ManyToOne((type) => UserEntity, {
    lazy: true,
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn()
  user: UserEntity | Promise<UserEntity>;

  @Column({
    nullable: false,
  })
  name: string;

  @Column()
  address: string;

  @Column({
    nullable: true,
  })
  detailAddress: string;

  @Column()
  recieverName: string;

  @Column()
  recieverPhoneNumber: string;

  @Column({
    default: false,
  })
  isDefault: boolean;
}
