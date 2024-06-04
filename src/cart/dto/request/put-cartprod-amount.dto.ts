import { IsNotEmpty, IsNumber, Min } from 'class-validator';

export class PutCartprodQuantityDto {
  @IsNotEmpty()
  @IsNumber()
  @Min(1)
  quantity: number;
}
