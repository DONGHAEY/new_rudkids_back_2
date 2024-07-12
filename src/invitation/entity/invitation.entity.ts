import { UserEntity } from 'src/user/entity/user.entity';
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  Generated,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryColumn,
} from 'typeorm';
import { InvitationTypeEnum } from './enum/invitation-type.enum';
import { CommunityEntity } from 'src/community/entity/community.entity';

@Entity('invitation')
export class InvitationEntity extends BaseEntity {
  @PrimaryColumn()
  @Generated('uuid')
  id: string;

  @Column({
    type: 'enum',
    enum: InvitationTypeEnum,
  })
  type: InvitationTypeEnum;

  @Column()
  description: string;

  @Column({
    default: 0,
  })
  acceptCnt: number;

  @Column({
    default: 1,
  })
  maxAcceptCnt: number;

  @ManyToOne((type) => UserEntity, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
    eager: true,
  })
  @JoinColumn()
  invitor: UserEntity;

  @OneToOne((type) => CommunityEntity, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
    eager: true,
  })
  @JoinColumn()
  community: CommunityEntity;

  @CreateDateColumn()
  createdAt: Date;
}
