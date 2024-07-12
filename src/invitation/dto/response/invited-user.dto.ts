import { Exclude, Expose } from 'class-transformer';
import { InstagramEmbeded } from 'src/user/entity/embeded/instagram.embeded';
import { UserEntity } from 'src/user/entity/user.entity';

@Exclude()
export class InvitedUserDto extends UserEntity {
  @Expose()
  nickname: string;

  @Expose()
  instagram: InstagramEmbeded;
}
