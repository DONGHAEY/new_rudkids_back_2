import { Type } from 'class-transformer';
import { IsEnum, IsInt, IsNumber, IsOptional } from 'class-validator';
import { Order } from './page-order.enum';

export class CursorPageRequestDto {
  @Type(() => String)
  @IsEnum(Order)
  @IsOptional()
  readonly sort?: Order = Order.DESC;

  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  readonly take?: number;

  @IsOptional()
  @Type(() => String)
  readonly cursorId?: string = '' as any;
}

export class OffsetPageRequestDto {
  @Type(() => String)
  @IsEnum(Order)
  @IsOptional()
  readonly sort?: Order;

  @Type(() => Number)
  @IsInt()
  @IsOptional()
  page?: number = 1;

  @Type(() => Number)
  @IsInt()
  @IsOptional()
  readonly take?: number = 9;

  get skip(): number {
    return this.page <= 0 ? (this.page = 0) : (this.page - 1) * this.take;
  }
}
