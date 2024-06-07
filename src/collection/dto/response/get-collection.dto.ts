import { Expose } from 'class-transformer';
import { CollectedProductDto } from './collected-product.dto';

@Expose()
export class GetCollectionDto {
  readonly collectorName: string;
  readonly collectedProducts: CollectedProductDto[];

  constructor(collectorName: string, collectedProducts: CollectedProductDto[]) {
    this.collectorName = collectorName;
    this.collectedProducts = collectedProducts;
  }
}
