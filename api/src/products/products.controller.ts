import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { ProductsService } from './products.service';
import { ProductDto } from './dto/product.dto';
import { Public } from '../auth/decorators/public.decorator';

@ApiTags('products')
@Public()
@Controller({ path: 'products', version: '1' })
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Get()
  @ApiOperation({ summary: 'Get all products' })
  @ApiResponse({
    status: 200,
    description: 'List of all products',
    type: [ProductDto],
  })
  @ApiResponse({ status: 503, description: 'Products service unavailable' })
  async findAll(): Promise<ProductDto[]> {
    return this.productsService.getProducts();
  }
}
