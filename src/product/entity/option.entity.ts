import {
  BaseEntity,
  Column,
  Entity,
  Generated,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
} from 'typeorm';
import { ProductOptionGroupEntity } from './option-group.entity';

@Entity('product-option')
export class ProductOptionEntity extends BaseEntity {
  @PrimaryColumn()
  @Generated('uuid')
  id: string;

  @ManyToOne(
    (type) => ProductOptionGroupEntity,
    (optionGroupEntity) => optionGroupEntity.options,
    {
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
      lazy: true,
    },
  )
  @JoinColumn()
  optionGroup: ProductOptionGroupEntity | Promise<ProductOptionGroupEntity>;

  @Column()
  name: string;

  @Column()
  price: number;

  @Column()
  priority: number;
}
