import { Column } from 'typeorm';

export class DiscountPriceEmbeded {
  //
  @Column({
    default: 0,
  })
  orderProducts: number; //상품가격
  //
  @Column({
    default: 0,
  })
  shipping: number; //배송가격
}
