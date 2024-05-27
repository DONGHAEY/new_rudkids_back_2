import { Type } from 'class-transformer';
import { IsEnum, IsInt, IsOptional } from 'class-validator';
import { Order } from './page-order.enum';

export class CursorPageRequestDto {
  @Type(() => String)
  @IsEnum(Order)
  @IsOptional()
  readonly sort?: Order = Order.DESC;

  @Type(() => Number)
  @IsOptional()
  readonly take?: number;

  @Type(() => String)
  @IsOptional()
  readonly cursorId?: number = '' as any;
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
