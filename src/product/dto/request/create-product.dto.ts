import {
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateProductDto {
  //
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  category: string;

  @IsNotEmpty()
  @IsNumber()
  price: number;

  @IsNotEmpty()
  @IsString()
  description: string;

  @IsNotEmpty()
  @IsString()
  thumnail: string;

  @IsNotEmpty()
  @IsString()
  seasonName: string;

  @IsNotEmpty()
  @IsBoolean()
  isPackage: boolean;

  @IsOptional()
  @IsString()
  detailImageUrls: string;
}
