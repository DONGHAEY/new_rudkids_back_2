import { IsNotEmpty, IsString, Min, MinLength } from 'class-validator';

export class CreateCommunityDto {
  @IsNotEmpty()
  @IsString()
  @MinLength(1)
  name: string;

  @IsNotEmpty()
  @IsString()
  imageUrl: string;
}
