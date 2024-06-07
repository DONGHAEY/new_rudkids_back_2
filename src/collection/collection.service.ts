import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CollectedProduct } from './entity/collected-product.entity';
import { Repository } from 'typeorm';
import { UserEntity } from 'src/user/entity/user.entity';
import { OffsetPageRequestDto } from 'src/dto/pagination/page-request.dto';
import { OffsetPageMetaDto } from 'src/dto/pagination/page-meta.dto';
import { PageResponseDto } from 'src/dto/pagination/page-response.dto';
import { CollectedProductDto } from './dto/response/collected-product.dto';
import { ProductEntity } from 'src/product/entity/product.entity';

@Injectable()
export class CollectionService {
  constructor(
    @InjectRepository(CollectedProduct)
    private collectedProductRepo: Repository<CollectedProduct>,
  ) {}

  // async query

  async getMyCollection(
    user: UserEntity,
    offsetPageRequest: OffsetPageRequestDto,
  ): Promise<PageResponseDto<CollectedProductDto>> {
    const [collectedProducts, total] =
      await this.collectedProductRepo.findAndCount({
        where: {
          owner: {
            id: user.id,
          },
        },
        take: offsetPageRequest.take,
        skip: offsetPageRequest.skip,
        order: {
          createdAt: 'ASC',
        },
      });
    const offsetPageMeta = new OffsetPageMetaDto({
      total,
      offsetPageRequest,
    });

    return new PageResponseDto(
      collectedProducts.map(
        (colllectedProduct) =>
          new CollectedProductDto(
            colllectedProduct.product.id,
            colllectedProduct.product.name,
            colllectedProduct.product.thumnail,
          ),
      ),
      offsetPageMeta,
    );
  }

  async setMyCollection(user: UserEntity, product: ProductEntity) {
    const hasSame = await this.collectedProductRepo.findOneBy({
      owner: { id: user.id },
      product: { id: product.id },
    });
    if (hasSame) return;
    await this.collectedProductRepo
      .create({
        owner: user,
        product,
      })
      .save();
  }
}
