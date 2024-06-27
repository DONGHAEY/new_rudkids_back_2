import {
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class AddToCartDto {
  @IsNotEmpty()
  @IsString()
  productId: string;

  @IsArray()
  optionIds: string[];

  @IsOptional()
  @IsNumber()
  quantity: number;
}
