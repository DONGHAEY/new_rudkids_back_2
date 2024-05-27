import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { CheckAdmin } from 'src/auth/decorators/checkAdmin.decorator';
import JwtAuthGuard from 'src/auth/guards/auth.guard';
import { ProductService } from './product.service';
import { CreateProductDto } from './dto/create-product.dto';
import AdminCheckGuard from 'src/auth/guards/admin-check.guard';

@Controller('product')
export class ProductController {
  constructor(private productService: ProductService) {}

  @Get()
  async getProductList(@Query('seasonName') seasonName: string) {
    return await this.productService.getProductList(seasonName);
  }

  @Get('/:product_name')
  async getProduct(@Param('product_name') productName: string) {
    return await this.productService.getProduct(productName);
  }

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
}
