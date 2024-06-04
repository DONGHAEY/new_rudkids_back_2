import { IsNotEmpty, IsString, ValidateNested } from 'class-validator';
import { PatchShippingDto } from './patch-shipping.dto';
import { Type } from 'class-transformer';

export class CreateOrderDto {
  @IsNotEmpty()
  @IsString()
  cartId: string;

  @IsNotEmpty()
  @ValidateNested()
  @Type(() => PatchShippingDto)
  shipping: PatchShippingDto;
}
