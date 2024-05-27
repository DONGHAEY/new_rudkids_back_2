import { ProductComponentEntity } from 'src/product-component/entity/product-component.entity';
import { SeasonEntity } from 'src/season/entity/season.entity';
import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('product')
export class ProductEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => SeasonEntity, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
    lazy: true,
  })
  season: SeasonEntity | Promise<SeasonEntity>;

  @Column({
    unique: true,
  })
  name: string;

  @Column()
  price: number;

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
    default: false,
  })
  isPackage: boolean;

  @OneToMany(
    (type) => ProductComponentEntity,
    (productComponentEntity) => productComponentEntity.product,
  )
  @JoinColumn()
  components: ProductComponentEntity[];
}
