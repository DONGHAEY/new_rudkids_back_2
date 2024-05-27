import { IsNotEmpty, IsString, Max, Min } from 'class-validator';

export class CancelPaymentRequestDto {
  @IsNotEmpty()
  @IsString()
  @Min(1)
  @Max(200)
  cancelReason: string;
}
