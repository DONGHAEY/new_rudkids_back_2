import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { CheckAdmin } from 'src/auth/decorators/checkAdmin.decorator';
import JwtAuthGuard from 'src/auth/guards/auth.guard';
import { ProductService } from './product.service';
import { CreateProductDto } from './dto/request/create-product.dto';
import AdminCheckGuard from 'src/auth/guards/admin-check.guard';
import { SearchRequestDto } from './dto/request/search-request.dto';
import { OptionService } from './option.service';
import { CreateOptionDto } from './dto/request/create-option.dto';
import { CreateOptionGroupDto } from './dto/request/create-option-group.dto';
import { OffsetPageRequestDto } from 'src/dto/pagination/page-request.dto';
import { plainToClass } from 'class-transformer';

@Controller('product')
export class ProductController {
  //
  constructor(
    private productService: ProductService,
    private optionService: OptionService,
  ) {}

  @Get()
  async getProductList(
    @Query() searchQueries: SearchRequestDto,
    @Query() offsetPageReqDto: OffsetPageRequestDto,
  ) {
    searchQueries = plainToClass(SearchRequestDto, searchQueries, {
      strategy: 'exposeAll',
    });
    offsetPageReqDto = plainToClass(OffsetPageRequestDto, offsetPageReqDto, {
      strategy: 'exposeAll',
    });
    return await this.productService.getProductList(
      searchQueries,
      offsetPageReqDto,
    );
  }

  @Get('/:product_name')
  async getProduct(@Param('product_name') productName: string) {
    return await this.productService.getProduct(productName);
  }

  // Admin API//
  @Post()
  @UseGuards(JwtAuthGuard, AdminCheckGuard)
  @CheckAdmin()
  async createProduct(@Body() createProductDto: CreateProductDto) {
    return await this.productService.createProduct(createProductDto);
  }

  @Delete('/:product_id')
  @UseGuards(JwtAuthGuard, AdminCheckGuard)
  @CheckAdmin()
  async deleteProduct(@Param('product_id', ParseIntPipe) productId: number) {
    return await this.productService.deleteProduct(productId);
  }

  /*********  */

  @Post('/option-group/:product_id')
  createOptinGroup(
    @Param('product_id', ParseIntPipe) productId: number,
    @Body() createOptionGroupDto: CreateOptionGroupDto,
  ) {
    return this.optionService.createOptionGroup(
      productId,
      createOptionGroupDto.name,
    );
  }

  @Post('/option/:option_group_id')
  createOption(
    @Param('option_group_id') optionGroupId: string,
    @Body() createOptionDto: CreateOptionDto,
  ) {
    return this.optionService.createOption(optionGroupId, createOptionDto);
  }

  @Delete('/option-group/:option_group_id')
  deleteOptionGroup(@Param('option_group_id') optionGroupId: string) {
    return this.optionService.deleteOptionGroup(optionGroupId);
  }

  @Delete('/option/:id')
  deleteOption(@Param('id') optionId: string) {
    return this.optionService.deleteOption(optionId);
  }

  @Put('/option-group/:id')
  updateOptionGroup(
    @Param('id') id: string,
    @Body() createOptionGroupDto: CreateOptionGroupDto,
  ) {
    return this.optionService.changeOptionGroupName(
      id,
      createOptionGroupDto.name,
    );
  }
}
