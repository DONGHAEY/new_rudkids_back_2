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
import { ListOfProductResponseDto } from './dto/ListOfProduct-response.dto';
import { ProductComponentEntity } from 'src/product-component/entity/product-component.entity';

@Injectable()
export class ProductService {
  //
  constructor(
    @InjectRepository(ProductEntity)
    private productRepository: Repository<ProductEntity>,
    @InjectRepository(ProductComponentEntity)
    private productComponentRepository: Repository<ProductComponentEntity>,
    @InjectRepository(SeasonEntity)
    private seasonRepository: Repository<SeasonEntity>,
  ) {}

  async getProductList(
    seasonName: string,
  ): Promise<ListOfProductResponseDto[]> {
    let where: any = {};
    if (seasonName) {
      where.name = seasonName;
    }
    const products = await this.productRepository.findBy(where);
    return await Promise.all(
      products?.map(async (product) => {
        const presentComponent =
          await this.productComponentRepository.findOneBy({
            priority: 1,
            product: {
              id: product.id,
            },
          });
        const listOfProductResponseDto = new ListOfProductResponseDto();
        listOfProductResponseDto.id = product.id;
        listOfProductResponseDto.thumnail = presentComponent
          ? presentComponent.imageUrl
          : product.imageUrl;
        listOfProductResponseDto.name = product.name;
        listOfProductResponseDto.isPackage = product.isPackage;
        return listOfProductResponseDto;
      }),
    );
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
    newProduct.price = createProductDto.price;
    newProduct.imageUrl = createProductDto.imageUrl;
    newProduct.modelUrl = createProductDto.modelUrl;
    newProduct.isPackage = createProductDto.isPackage;
    newProduct.description = createProductDto.description;
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
