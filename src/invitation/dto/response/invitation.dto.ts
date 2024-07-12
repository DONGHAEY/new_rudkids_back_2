import { Exclude, Expose } from 'class-transformer';
import { InvitationEntity } from '../../entity/invitation.entity';
import { InvitationTypeEnum } from '../../entity/enum/invitation-type.enum';

@Exclude()
export class InvitationDto extends InvitationEntity {
  @Expose()
  id: string;

  @Expose()
  fromName: string;

  @Expose()
  fromImageUrl: string;

  @Expose()
  invitorId: string | null;

  @Expose()
  description: string;

  @Expose()
  acceptCnt: number;

  @Expose()
  maxAcceptCnt: number;

  @Expose()
  type: InvitationTypeEnum;
}
