import {
  BaseEntity,
  Column,
  Entity,
  Generated,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryColumn,
} from 'typeorm';
import { ProductOptionEntity } from './option.entity';
import { ProductEntity } from './product.entity';

@Entity('product-option-group')
export class ProductOptionGroupEntity extends BaseEntity {
  @PrimaryColumn()
  @Generated('uuid')
  id: string;

  @Column()
  name: string;

  @ManyToOne(
    (type) => ProductEntity,
    (productEntity) => productEntity.optionGroups,
    {
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
      lazy: true,
    },
  )
  @JoinColumn()
  product: ProductEntity | Promise<ProductEntity>;

  @OneToMany(
    (type) => ProductOptionEntity,
    (optionEntity) => optionEntity.optionGroup,
    {
      eager: true,
    },
  )
  @JoinColumn()
  options: ProductOptionEntity[];

  @Column()
  priority: number;
}
