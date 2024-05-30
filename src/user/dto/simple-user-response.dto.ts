import { Exclude, Expose, Type } from 'class-transformer';
import { ViewEmbeded } from '../entity/embeded/view.embeded';

@Exclude()
export class SimpleUserDto {
  @Expose()
  id: string;

  @Expose()
  nickname: string;

  @Expose()
  imageUrl: string;

  @Expose()
  @Type(() => ViewEmbeded)
  view: ViewEmbeded;
}
