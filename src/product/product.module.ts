import { Module } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductEntity } from './entity/product.entity';
import { SeasonEntity } from 'src/season/entity/season.entity';
import { ProductComponentEntity } from 'src/product-component/entity/product-component.entity';
import { ProductOptionGroupEntity } from './entity/option-group.entity';
import { ProductOptionEntity } from './entity/option.entity';
import { OptionService } from './option.service';
// import { ProductOptionEntity } from 'src/product-option/entity/product-option.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      SeasonEntity,
      ProductEntity,
      ProductComponentEntity,
      ProductOptionGroupEntity,
      ProductOptionEntity,
    ]),
  ],
  providers: [ProductService, OptionService],
  controllers: [ProductController],
  exports: [TypeOrmModule],
})
export class ProductModule {}
