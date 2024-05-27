import {
  BaseEntity,
  CreateDateColumn,
  Entity,
  Generated,
  ManyToOne,
  PrimaryColumn,
} from 'typeorm';
import { UserEntity } from './user.entity';

@Entity('user-follow')
export class UserFollowEntity extends BaseEntity {
  @PrimaryColumn()
  @Generated('uuid')
  id: string;

  @ManyToOne((type) => UserEntity, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  follower: UserEntity;

  @ManyToOne((type) => UserEntity, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  targetUser: UserEntity;

  @CreateDateColumn()
  createAt: Date;
}
