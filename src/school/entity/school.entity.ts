import { BaseEntity, Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('school')
export class SchoolEntity extends BaseEntity {
  @PrimaryColumn()
  name: string;

  @Column({
    type: 'longtext',
  })
  imageUrl: string;

  @Column({
    length: 50,
    nullable: true,
  })
  description: string;
}
