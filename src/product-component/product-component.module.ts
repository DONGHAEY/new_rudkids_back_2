import { Module } from '@nestjs/common';
import { ProductComponentService } from './product-component.service';
import { ProductComponentController } from './product-component.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductEntity } from 'src/product/entity/product.entity';
import { ProductComponentEntity } from './entity/product-component.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ProductEntity, ProductComponentEntity])],
  providers: [ProductComponentService],
  controllers: [ProductComponentController],
  exports: [TypeOrmModule],
})
export class ProductComponentModule {}
