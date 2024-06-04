import { Expose, Type } from 'class-transformer';

@Expose()
export class GetCartProductDto {
  id: string;
  cartProducts: CartProductDto[];
  shippingPrice: number;
}

export class CartProductDto {
  id: string;
  productId: number;
  quantity: number;
  type: string;
  name: string;
  price: number;
  thumnail: string;
  selectedOptions: SelectedOptionDto[];
}

export class SelectedOptionDto {
  id: string;
  groupName: string;
  optionName: string;
  price: number;
}
