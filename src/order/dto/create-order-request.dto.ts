import { IsNotEmpty, IsString, ValidateNested } from 'class-validator';
import { PatchShippingRequestDto } from './patch-shipping-request.dto';
import { Type } from 'class-transformer';

export class CreateOrderRequestDto {
  @IsNotEmpty()
  @IsString()
  cartId: string;

  @IsNotEmpty()
  @ValidateNested()
  @Type(() => PatchShippingRequestDto)
  shipping: PatchShippingRequestDto;
}
