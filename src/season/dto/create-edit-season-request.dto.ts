import { IsBoolean, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateEditSeasonRequestDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  description: string;

  @IsOptional()
  @IsString()
  imageUrl: string;

  @IsNotEmpty()
  @IsBoolean()
  isActive: boolean;
}
