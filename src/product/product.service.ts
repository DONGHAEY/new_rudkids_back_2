import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ProductEntity } from './entity/product.entity';
import { Repository } from 'typeorm';
import { CreateProductDto } from './dto/request/create-product.dto';
import { SeasonEntity } from 'src/season/entity/season.entity';
import { SearchRequestDto } from './dto/request/search-request.dto';
import { OffsetPageRequestDto } from 'src/dto/pagination/page-request.dto';
import { OffsetPageMetaDto } from 'src/dto/pagination/page-meta.dto';
import { PageResponseDto } from 'src/dto/pagination/page-response.dto';

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
    offsetPageRequest: OffsetPageRequestDto,
  ): Promise<PageResponseDto<ProductEntity>> {
    const searchQ = {};

    Object.keys(searchQueries).forEach((key: any) => {
      if (searchQueries[key]) {
        searchQ[key] = searchQueries[key];
      }
    });
    const [products, total] = await this.productRepository.findAndCount({
      where: searchQ,
      take: offsetPageRequest.take,
      skip: offsetPageRequest.skip,
    });
    const meta = new OffsetPageMetaDto({
      total,
      offsetPageRequest,
    });
    return new PageResponseDto<ProductEntity>(products, meta);
  }

  async getProduct(productName: string): Promise<ProductEntity> {
    const product = await this.productRepository.findOne({
      where: {
        name: productName,
      },
      relations: {
        optionGroups: true,
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
    const newProduct = new ProductEntity();
    newProduct.name = createProductDto.name;
    newProduct.season = season;
    newProduct.category = createProductDto.category;
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

  async deleteProduct(productId: string): Promise<void> {
    const product = await this.productRepository.findOneBy({
      id: productId,
    });
    if (product === null) {
      throw new HttpException('없는 상품', HttpStatus.NOT_FOUND);
    }
    await product.remove();
  }
}
