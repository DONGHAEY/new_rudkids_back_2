import { Expose, Type } from 'class-transformer';

@Expose()
export class GetCartProductDto {
  id: string;
  cartProducts: CartProductDto[];
  shippingPrice: number;
}

export class CartProductDto {
  id: string;
  productId: string;
  quantity: number;
  category: string;
  name: string;
  price: number;
  thumnail: string;
  options: SelectedOptionDto[];
}

export class SelectedOptionDto {
  id: string;
  groupName: string;
  name: string;
  price: number;
}
