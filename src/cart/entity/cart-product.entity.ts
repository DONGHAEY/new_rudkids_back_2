import { ProductEntity } from 'src/product/entity/product.entity';
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  Generated,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  PrimaryColumn,
} from 'typeorm';
import { CartEntity } from './cart.entity';
import { ProductOptionEntity } from 'src/product/entity/option.entity';

@Entity('cart-product')
export class CartProductEntity extends BaseEntity {
  @PrimaryColumn()
  @Generated('uuid')
  id: string;

  @Column({
    default: 1,
  })
  quantity: number;

  @ManyToOne((type) => CartEntity, (cartEntity) => cartEntity.cartProducts, {
    nullable: false,
    lazy: true,
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn()
  cart: CartEntity | Promise<CartEntity>;

  @ManyToOne((type) => ProductEntity, {
    nullable: false,
    eager: true,
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn()
  product: ProductEntity;

  @ManyToMany(() => ProductOptionEntity, {
    eager: true,
  })
  @JoinTable()
  options: ProductOptionEntity[];

  @CreateDateColumn()
  createdAt: Date;
}
