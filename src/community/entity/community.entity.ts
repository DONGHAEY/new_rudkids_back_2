import { BaseEntity, Column, Entity, Generated, PrimaryColumn } from 'typeorm';

@Entity('community')
export class CommunityEntity extends BaseEntity {
  @PrimaryColumn()
  @Generated('uuid')
  id: string;

  @Column({
    unique: true,
  })
  name: string;

  @Column({
    type: 'longtext',
  })
  imageUrl: string;
}
