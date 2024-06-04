import { IsArray, IsNotEmpty, IsNumber } from 'class-validator';

export class AddToCartDto {
  @IsNotEmpty()
  @IsNumber()
  productId: number;

  @IsArray()
  optionIds: string[];

  // @IsNotEmpty()
  // @IsNumber()
  // quantity: number;
}
