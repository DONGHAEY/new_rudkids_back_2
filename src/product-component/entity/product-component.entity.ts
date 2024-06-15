import { ProductEntity } from 'src/product/entity/product.entity';
import {
  BaseEntity,
  Column,
  Entity,
  Generated,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
  Unique,
} from 'typeorm';

@Entity('product-component')
@Unique(['name', 'product'])
export class ProductComponentEntity extends BaseEntity {
  @PrimaryColumn()
  @Generated('uuid')
  id: string;

  @ManyToOne(
    (type) => ProductEntity,
    (productEntity) => productEntity.components,
    {
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
      lazy: true,
    },
  )
  @JoinColumn()
  product: ProductEntity | Promise<ProductEntity>;

  @Column()
  name: string;

  @Column()
  description: string;

  @Column({
    type: 'longtext',
  })
  imageUrl: string;

  @Column({
    type: 'longtext',
  })
  modelUrl: string;

  @Column({
    default: 0,
  })
  priority: number;
}
