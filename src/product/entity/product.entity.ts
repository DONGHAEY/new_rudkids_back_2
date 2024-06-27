import { ProductComponentEntity } from 'src/product-component/entity/product-component.entity';
import { SeasonEntity } from 'src/season/entity/season.entity';
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
import { ProductOptionGroupEntity } from './option-group.entity';

@Entity('product')
export class ProductEntity extends BaseEntity {
  @PrimaryColumn()
  @Generated('uuid')
  id: string;

  @ManyToOne(() => SeasonEntity, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
    lazy: true,
  })
  season: SeasonEntity | Promise<SeasonEntity>;

  @Column({
    default: '',
  })
  category: string;

  @Column({
    unique: true,
  })
  name: string;

  @Column()
  price: number;

  @Column({
    type: 'longtext',
  })
  thumnail: string;

  @Column()
  description: string;

  @Column({
    type: 'longtext',
    default: '',
  })
  detailImageUrls: string;

  @Column({
    default: false,
  })
  isPackage: boolean;

  @OneToMany(
    () => ProductOptionGroupEntity,
    (optionGroupEntity) => optionGroupEntity.product,
  )
  @JoinColumn()
  optionGroups: ProductOptionGroupEntity[];

  @OneToMany(
    (type) => ProductComponentEntity,
    (productComponentEntity) => productComponentEntity.product,
  )
  @JoinColumn()
  components: ProductComponentEntity[];

  // @Column()
  // status :
}
