import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ProductOptionGroupEntity } from './entity/option-group.entity';
import { Repository } from 'typeorm';
import { ProductOptionEntity } from './entity/option.entity';
import { ProductEntity } from './entity/product.entity';
import { CreateOptionDto } from './dto/request/create-option.dto';

@Injectable()
export class OptionService {
  constructor(
    @InjectRepository(ProductOptionGroupEntity)
    private readonly optionGroupRepo: Repository<ProductOptionGroupEntity>,
    @InjectRepository(ProductOptionEntity)
    private readonly optionRepository: Repository<ProductOptionEntity>,
    @InjectRepository(ProductEntity)
    private readonly productRepository: Repository<ProductEntity>,
  ) {}

  async createOptionGroup(productId: number, name: string) {
    const product = await this.productRepository.findOneBy({ id: productId });
    if (!product) throw new NotFoundException('item not found');
    return await this.optionGroupRepo
      .create({
        name,
        product,
      })
      .save();
  }

  async createOption(optionGroupId: string, createOptionDto: CreateOptionDto) {
    const optionGroup = await this.optionGroupRepo.findOneBy({
      id: optionGroupId,
    });
    if (!optionGroup) throw new NotFoundException('optionGroup not found');
    await this.optionRepository
      .create({
        optionGroup: optionGroup,
        ...createOptionDto,
      })
      .save();
  }

  async deleteOptionGroup(optionGroupId: string) {
    const optionGroup = await this.optionGroupRepo.findOneBy({
      id: optionGroupId,
    });
    if (!optionGroup) throw new NotFoundException('optionGroup not found');
    await optionGroup.remove();
    return;
  }

  async deleteOption(optionId: string) {
    const option = await this.optionRepository.findOneBy({
      id: optionId,
    });
    if (!option) throw new NotFoundException('option is not fount');
    await option.remove();
    return;
  }

  async changeOptionGroupName(optionGroupId: string, name: string) {
    const optionGroup = await this.optionGroupRepo.findOneBy({
      id: optionGroupId,
    });
    if (!optionGroup) throw new NotFoundException('optionGroup not fount');
    optionGroup.name = name;
    await optionGroup.save();
    return await this.optionGroupRepo.findOneBy({ id: optionGroupId });
  }
}
