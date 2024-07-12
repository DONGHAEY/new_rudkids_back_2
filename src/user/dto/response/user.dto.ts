import { Exclude, Expose, Type } from 'class-transformer';
import { ViewEmbeded } from '../../entity/embeded/view.embeded';
import { InstagramEmbeded } from 'src/user/entity/embeded/instagram.embeded';
import { OnboardingStepEnum } from 'src/user/entity/enum/onboarding-step.enum';

@Exclude()
export class UserResponseDto {
  @Expose()
  id: string;

  @Expose()
  nickname: string;

  @Expose()
  cardImgUrl: string;

  @Expose()
  @Type(() => InstagramEmbeded)
  instagram: InstagramEmbeded;

  @Expose()
  @Type(() => ViewEmbeded)
  view: ViewEmbeded;

  @Expose()
  @Type(() => String)
  links: string[];

  @Expose()
  onboardingStep: OnboardingStepEnum;

  @Expose()
  introduce: string;

  @Expose()
  isFollower: boolean;

  @Expose()
  followerCnt: number;

  @Expose()
  rankOfView: number;
}
