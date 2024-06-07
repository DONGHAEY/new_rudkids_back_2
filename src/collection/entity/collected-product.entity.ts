import { ProductEntity } from 'src/product/entity/product.entity';
import { UserEntity } from 'src/user/entity/user.entity';
import {
  BaseEntity,
  CreateDateColumn,
  Entity,
  Generated,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
} from 'typeorm';

@Entity('collected-product')
export class CollectedProduct extends BaseEntity {
  @PrimaryColumn()
  @Generated('uuid')
  id: string;

  @ManyToOne((type) => ProductEntity, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
    eager: true,
  })
  @JoinColumn()
  product: ProductEntity;

  @ManyToOne((type) => UserEntity, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
    eager: true,
  })
  @JoinColumn()
  owner: UserEntity;

  @CreateDateColumn()
  createdAt: Date;
}
