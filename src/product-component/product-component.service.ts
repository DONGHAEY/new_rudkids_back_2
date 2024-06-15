import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ProductComponentEntity } from './entity/product-component.entity';
import { Repository } from 'typeorm';
import { ProductEntity } from 'src/product/entity/product.entity';
import { CreateProductComponentDto } from './dto/create-product-component.dto';

@Injectable()
export class ProductComponentService {
  constructor(
    @InjectRepository(ProductComponentEntity)
    private productComponentRepository: Repository<ProductComponentEntity>,
    @InjectRepository(ProductEntity)
    private productRepository: Repository<ProductEntity>,
  ) {}

  async createProductComponent(
    productId: string,
    createProductComponentDto: CreateProductComponentDto,
  ): Promise<void> {
    const product = await this.productRepository.findOneBy({
      id: productId,
    });
    if (!product) throw new NotFoundException();
    await this.checkSameProductComponent(
      product.id,
      createProductComponentDto.name,
    );
    const newProductComponent = new ProductComponentEntity();
    newProductComponent.product = product;
    newProductComponent.name = createProductComponentDto.name;
    newProductComponent.description = createProductComponentDto.description;
    newProductComponent.imageUrl = createProductComponentDto.imageUrl;
    newProductComponent.modelUrl = createProductComponentDto.modelUrl;
    newProductComponent.priority = createProductComponentDto.priority;
    await newProductComponent.save();
  }

  private async checkSameProductComponent(
    productId: string,
    productComponentName: string,
  ): Promise<void> {
    const sameProductComponent =
      await this.productComponentRepository.findOneBy({
        product: {
          id: productId,
        },
        name: productComponentName,
      });
    if (sameProductComponent) {
      throw new HttpException('이미 등록된 이름', HttpStatus.FOUND);
    }
  }

  async delteProductComponent(productComponentId: string): Promise<void> {
    const productComponent = await this.productComponentRepository.findOneBy({
      id: productComponentId,
    });
    if (!productComponent) throw new NotFoundException();
    await this.productComponentRepository.delete({
      id: productComponentId,
    });
  }
}
