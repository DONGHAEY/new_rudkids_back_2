import { Exclude, Expose } from 'class-transformer';
import { IsOptional } from 'class-validator';

@Exclude()
export class SearchRequestDto {
  @IsOptional()
  @Expose()
  seasonName: string;

  @IsOptional()
  @Expose()
  category: string;
}
