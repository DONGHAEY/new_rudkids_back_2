import { Exclude, Expose, Type } from 'class-transformer';
import { ViewEmbeded } from '../../entity/embeded/view.embeded';
import { InstagramEmbeded } from 'src/user/entity/embeded/instagram.embeded';
import { UserEntity } from 'src/user/entity/user.entity';

@Exclude()
export class SimpleUserDto extends UserEntity {
  @Expose()
  id: string;

  @Expose()
  nickname: string;

  @Expose()
  @Type(() => InstagramEmbeded)
  instagram: InstagramEmbeded;

  @Expose()
  @Type(() => ViewEmbeded)
  view: ViewEmbeded;
}
