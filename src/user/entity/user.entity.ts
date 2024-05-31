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
import { PrivacyEmbeded } from './embeded/privacy.embeded';
import { SchoolEntity } from 'src/school/entity/school.entity';
import { ViewEmbeded } from './embeded/view.embeded';

@Entity('user')
export class UserEntity extends BaseEntity {
  @PrimaryColumn()
  @Generated('uuid')
  id: string;

  @Column((type) => PrivacyEmbeded)
  privacy: PrivacyEmbeded; //개인정보

  @Column({
    unique: true,
  })
  nickname: string; //프로필네임(닉네임)

  /** Profile INFO */
  @Column()
  instagramId: string; //인스타그램 아이디

  @Column({
    default: '/Image/rudkidsLogo.png',
  })
  imageUrl: string; //사진url

  @Column({
    default: null,
    nullable: true,
    type: 'longtext',
  })
  cardImgUrl: string;

  @Column((type) => ViewEmbeded)
  view: ViewEmbeded;

  @Column({
    type: 'longtext',
    default: '',
  })
  links: string; //소셜링크들

  @Column({
    type: 'longtext',
    default: '소개글이 없어요',
  })
  introduce: string; //소개글

  @Column({
    default: 0,
  })
  invitateCnt: number; //초대한 횟수
  /** Profile INFO */

  @ManyToOne(() => SchoolEntity, {
    onDelete: 'SET NULL',
    onUpdate: 'CASCADE',
    lazy: true,
  })
  school: SchoolEntity;

  @Column({
    default: false,
  })
  isAdmin: boolean; //어드민여부

  @ManyToOne(() => UserEntity, {
    onDelete: 'SET NULL',
    onUpdate: 'CASCADE',
    lazy: true,
  })
  @JoinColumn()
  inviter: UserEntity | Promise<UserEntity>; //초대자

  @Column({
    default: false,
  })
  isInvited: boolean;

  @CreateDateColumn()
  createdAt: Date; //가입일
}
