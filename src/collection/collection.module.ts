import { Module } from '@nestjs/common';
import { CollectionController } from './collection.controller';
import { CollectionService } from './collection.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CollectedProduct } from './entity/collected-product.entity';

@Module({
  imports: [TypeOrmModule.forFeature([CollectedProduct])],
  controllers: [CollectionController],
  providers: [CollectionService],
  exports: [TypeOrmModule],
})
export class CollectionModule {}
