import { IsArray, IsNotEmpty, ValidateNested } from 'class-validator';
import { PatchShippingDto } from './patch-shipping.dto';
import { Type } from 'class-transformer';
import { OrderingProductDto } from './ordering-product.dto';

export class CreateOrderDto {
  //
  @IsArray()
  @ValidateNested()
  @Type(() => OrderingProductDto)
  orderingProducts: OrderingProductDto[];

  @IsNotEmpty()
  @ValidateNested()
  @Type(() => PatchShippingDto)
  shipping: PatchShippingDto;
}
