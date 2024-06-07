import { Exclude, Expose } from 'class-transformer';

@Exclude()
export class CollectedProductDto {
  @Expose()
  productId: any;
  @Expose()
  name: string;
  @Expose()
  thumnail: string;
}
