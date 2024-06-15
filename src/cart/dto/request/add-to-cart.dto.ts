import { IsArray, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class AddToCartDto {
  @IsNotEmpty()
  @IsString()
  productId: string;

  @IsArray()
  optionIds: string[];

  // @IsNotEmpty()
  // @IsNumber()
  // quantity: number;
}
