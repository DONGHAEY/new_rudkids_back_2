import { Exclude, Expose } from 'class-transformer';
import { UserEntity } from 'src/user/entity/user.entity';

@Exclude()
export class FriendDto extends UserEntity {
  @Expose()
  instagramId: string;
  @Expose()
  nickname: string;
  @Expose()
  imageUrl: string;
}
