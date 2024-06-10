import { Exclude, Expose, Type } from 'class-transformer';
import { ViewEmbeded } from '../entity/embeded/view.embeded';

@Exclude()
export class UserResponseDto {
  @Expose()
  id: string;

  @Expose()
  instagramId: string;

  @Expose()
  nickname: string;

  @Expose()
  cardImgUrl: string;

  @Expose()
  imageUrl: string;

  @Expose()
  invitateCnt: number;

  @Expose()
  @Type(() => ViewEmbeded)
  view: ViewEmbeded;

  @Expose()
  links: string[];

  @Expose()
  introduce: string;

  @Expose()
  isInvited: boolean;

  @Expose()
  isFollower: boolean;

  @Expose()
  rank: number;

  @Expose()
  isFirstInviteFinished: boolean;

  @Expose()
  followerCnt: number;
}
