import { UserEntity } from 'src/user/entity/user.entity';
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  Generated,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
} from 'typeorm';
import { SchoolEntity } from 'src/school/entity/school.entity';

@Entity('invitation')
export class InvitationEntity extends BaseEntity {
  @PrimaryColumn()
  @Generated('uuid')
  id: string;

  @Column({
    nullable: false,
  })
  fromName: string;

  @Column({ nullable: false })
  fromImageUrl: string;

  @ManyToOne((type) => UserEntity, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
    eager: true,
  })
  @JoinColumn()
  inviter: UserEntity;

  @ManyToOne((type) => SchoolEntity, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
    eager: true,
  })
  school: SchoolEntity;

  @CreateDateColumn()
  createdAt: Date;
}
