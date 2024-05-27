import { ProductEntity } from 'src/product/entity/product.entity';
import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';

@Entity('product-component')
@Unique(['name', 'product'])
export class ProductComponentEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

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
