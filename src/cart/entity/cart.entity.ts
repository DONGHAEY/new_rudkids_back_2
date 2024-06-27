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
  PrimaryColumn,
} from 'typeorm';
import { CartProductEntity } from './cart-product.entity';

@Entity('cart')
export class CartEntity extends BaseEntity {
  @PrimaryColumn()
  @Generated('uuid')
  id: string;

  @ManyToOne((type) => UserEntity, {
    lazy: true,
    nullable: false,
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn()
  user: UserEntity | Promise<UserEntity>;

  @OneToMany(
    (type) => CartProductEntity,
    (cartProductEntity) => cartProductEntity.cart,
    {
      eager: true,
    },
  )
  @JoinColumn()
  cartProducts: CartProductEntity[];

  @CreateDateColumn()
  createdAt: Date;
}
