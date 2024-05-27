import { BaseEntity, Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('season')
export class SeasonEntity extends BaseEntity {
  @PrimaryColumn()
  name: string;

  @Column({
    nullable: true,
  })
  imageUrl: string;

  @Column()
  description: string;

  @Column({
    default: true,
  })
  active: boolean;
}
