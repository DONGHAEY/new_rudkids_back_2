import { IsOptional } from 'class-validator';

export class SearchRequestDto {
  @IsOptional()
  seasonName: string;

  @IsOptional()
  type: string;
}
