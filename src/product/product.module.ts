import { Module } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductEntity } from './entity/product.entity';
import { SeasonEntity } from 'src/season/entity/season.entity';
import { ProductComponentEntity } from 'src/product-component/entity/product-component.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      SeasonEntity,
      ProductEntity,
      ProductComponentEntity,
    ]),
  ],
  providers: [ProductService],
  controllers: [ProductController],
  exports: [TypeOrmModule],
})
export class ProductModule {}
