export class CollectedProductDto {
  readonly productId: any;
  readonly name: string;
  readonly thumnail: string;

  constructor(productId: any, name: string, thumnail: string) {
    this.productId = productId;
    this.name = name;
    this.thumnail = thumnail;
  }
}
