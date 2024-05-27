import {
  Body,
  Controller,
  Delete,
  Param,
  ParseIntPipe,
  Post,
  UseGuards,
} from '@nestjs/common';
import { CheckAdmin } from 'src/auth/decorators/checkAdmin.decorator';
import JwtAuthGuard from 'src/auth/guards/auth.guard';
import { ProductComponentService } from './product-component.service';
import { CreateProductComponentDto } from './dto/create-product-component.dto';
import AdminCheckGuard from 'src/auth/guards/admin-check.guard';

@Controller('product-component')
@UseGuards(JwtAuthGuard, AdminCheckGuard)
export class ProductComponentController {
  constructor(private productComponentService: ProductComponentService) {}

  @Post('/:product_id')
  @CheckAdmin()
  async createProductComponent(
    @Param('product_id', ParseIntPipe) productId: number,
    @Body() createProductComponentDto: CreateProductComponentDto,
  ) {
    // product정보가 필요함, 어디 product에 등록할건지는..
    return await this.productComponentService.createProductComponent(
      productId,
      createProductComponentDto,
    );
  }

  @Delete('/:product_component_id')
  @CheckAdmin()
  async delteProductComponent(
    @Param('product_component_id', ParseIntPipe) productComponentId: number,
  ) {
    // productComponent id정보가 필요함.
    return await this.productComponentService.delteProductComponent(
      productComponentId,
    );
  }
}
