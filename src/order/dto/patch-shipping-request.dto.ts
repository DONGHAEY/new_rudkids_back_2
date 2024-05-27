import { IsEmpty, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { Shipping } from '../type/shipping';

export class PatchShippingRequestDto implements Shipping {
  @IsNotEmpty()
  @IsString()
  address: string;

  @IsOptional()
  @IsString()
  detailAddress: string;

  @IsOptional()
  @IsString()
  requestMemo: string;

  @IsNotEmpty()
  @IsString()
  recieverName: string;

  @IsNotEmpty()
  @IsString()
  recieverPhoneNumber: string;

  @IsEmpty()
  trackingNumber: string;
}
