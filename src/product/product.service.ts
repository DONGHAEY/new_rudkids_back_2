import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ProductEntity } from './entity/product.entity';
import { Repository } from 'typeorm';
import { CreateProductDto } from './dto/create-product.dto';
import { SeasonEntity } from 'src/season/entity/season.entity';
import { SearchRequestDto } from './dto/search-request.dto';

@Injectable()
export class ProductService {
  //
  constructor(
    @InjectRepository(ProductEntity)
    private productRepository: Repository<ProductEntity>,
    @InjectRepository(SeasonEntity)
    private seasonRepository: Repository<SeasonEntity>,
  ) {}

  async getProductList(
    searchQueries: SearchRequestDto,
  ): Promise<ProductEntity[]> {
    //
    const products = await this.productRepository.findBy({
      ...searchQueries,
    });
    return products;
  }

  async getProduct(productName: string): Promise<ProductEntity> {
    const product = await this.productRepository.findOne({
      where: {
        name: productName,
      },
      relations: {
        components: true,
      },
      order: {
        components: {
          priority: 'ASC',
        },
      },
    });
    if (!product) {
      throw new NotFoundException();
    }
    return product;
  }

  async createProduct(
    createProductDto: CreateProductDto,
  ): Promise<ProductEntity> {
    const season = await this.seasonRepository.findOneBy({
      name: createProductDto.seasonName,
    });
    if (!season) throw new NotFoundException('존재하지 않는 season입니다');
    await this.checkSameProduct(createProductDto.name);
    //
    const newProduct = new ProductEntity();
    newProduct.name = createProductDto.name;
    newProduct.type = createProductDto.type;
    newProduct.thumnail = createProductDto.thumnail;
    newProduct.price = createProductDto.price;
    newProduct.isPackage = createProductDto.isPackage;
    newProduct.description = createProductDto.description;
    newProduct.detailImageUrls = createProductDto.detailImageUrls;
    return await newProduct.save();
  }

  private async checkSameProduct(productName: string) {
    const sameNameProduct = await this.productRepository.findOneBy({
      name: productName,
    });
    if (sameNameProduct) {
      throw new HttpException('이미 존재하는 상품 이름', HttpStatus.FOUND);
    }
  }

  async deleteProduct(productId: number): Promise<void> {
    const product = await this.productRepository.findOneBy({
      id: productId,
    });
    if (product === null) {
      throw new HttpException('없는 상품', HttpStatus.NOT_FOUND);
    }
    await product.remove();
  }
}
