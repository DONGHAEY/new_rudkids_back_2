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
import { ViewEmbeded } from './embeded/view.embeded';
import { CommunityEntity } from 'src/community/entity/community.entity';
import { PlatformEnum } from 'src/auth/enum/platform.enum';
import { InstagramEmbeded } from './embeded/instagram.embeded';
import { OnboardingStepEnum } from './enum/onboarding-step.enum';

@Entity('user')
export class UserEntity extends BaseEntity {
  @PrimaryColumn()
  @Generated('uuid')
  id: string;

  @Column({
    type: 'enum',
    enum: OnboardingStepEnum,
    default: OnboardingStepEnum.COMPLETE_SIGNUP,
  })
  onboardingStep: OnboardingStepEnum;

  @Column({
    unique: true,
  })
  nickname: string;

  @Column((type) => PrivacyEmbeded)
  privacy: PrivacyEmbeded; //개인정보

  @Column((type) => InstagramEmbeded)
  instagram: InstagramEmbeded; //인스타그램

  @Column((type) => ViewEmbeded)
  view: ViewEmbeded; //조회수

  @Column({
    default: null,
    nullable: true,
    type: 'longtext',
  })
  cardImgUrl: string;

  @Column({
    type: 'longtext',
    default: '[]',
  })
  links: string; //소셜링크들

  @Column({
    type: 'longtext',
    default: '소개글이 없어요',
  })
  introduce: string; //소개글

  @Column({
    default: false,
  })
  isAdmin: boolean; //어드민여부

  @Column({
    nullable: true,
    default: null,
  })
  waitingOrder: number; //대기순번

  @Column({
    enum: PlatformEnum,
    type: 'enum',
  })
  platform: PlatformEnum;

  @ManyToOne(() => UserEntity, {
    onDelete: 'SET NULL',
    onUpdate: 'CASCADE',
    lazy: true,
  })
  @JoinColumn()
  invitor: UserEntity | Promise<UserEntity>; //초대자

  @ManyToOne(() => CommunityEntity, {
    onDelete: 'SET NULL',
    onUpdate: 'CASCADE',
    lazy: true,
  })
  @JoinColumn()
  community: CommunityEntity | Promise<CommunityEntity>;

  @CreateDateColumn()
  createdAt: Date; //가입일
}
