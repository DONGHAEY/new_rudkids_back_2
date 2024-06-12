import { Exclude, Expose, Type } from 'class-transformer';
import { InvitationEntity } from '../entity/invitation.entity';
import { FriendDto } from './friend.dto';

@Exclude()
export class FindInvitationResponseDto extends InvitationEntity {
  @Expose()
  id: string;

  @Expose()
  fromName: string;

  @Expose()
  fromImageUrl: string;

  @Expose()
  invitorId: string | null; //Inviter 식별자

  @Expose()
  type: string;

  @Expose()
  createdAt: Date;

  @Expose()
  @Type(() => FriendDto)
  friends: FriendDto[];
}
