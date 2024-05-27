import { IsBoolean, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class AddEditShippingRequestDto {
  @IsOptional()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  address: string;

  @IsOptional()
  @IsString()
  detailAddress: string;

  @IsNotEmpty()
  @IsString()
  recieverName: string;

  @IsNotEmpty()
  @IsString()
  recieverPhoneNumber: string;

  @IsNotEmpty()
  @IsBoolean()
  isDefault: boolean;
}
