import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { ProductsService } from './products.service';
import { ProductDto } from './dto/product.dto';

@ApiTags('products')
@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Get()
  @ApiOperation({ summary: 'Get all products' })
  @ApiResponse({
    status: 200,
    description: 'List of all products',
    type: [ProductDto],
  })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  async findAll(): Promise<ProductDto[]> {
    return this.productsService.findAll();
  }
}
