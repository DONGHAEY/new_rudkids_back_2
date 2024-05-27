import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateProductComponentDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  description: string;

  @IsNotEmpty()
  @IsString()
  imageUrl: string;

  @IsNotEmpty()
  @IsString()
  modelUrl: string;

  @IsOptional()
  @IsNumber()
  priority: number;
}
