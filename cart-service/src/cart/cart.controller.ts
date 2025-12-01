import {
  Controller,
  Get,
  Post,
  Delete,
  Param,
  Body,
  Headers,
  BadRequestException,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiHeader,
  ApiParam,
} from '@nestjs/swagger';
import { CartService } from './cart.service';
import { AddProductDto } from './dto/add-product.dto';
import { CartResponseDto } from './dto/cart-response.dto';

@ApiTags('cart')
@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Get()
  @ApiOperation({ summary: 'Get user cart' })
  @ApiHeader({
    name: 'x-user-id',
    description: 'User identifier',
    required: true,
    example: 'user-123',
  })
  @ApiResponse({
    status: 200,
    description: 'Cart retrieved successfully',
    type: CartResponseDto,
  })
  @ApiResponse({ status: 400, description: 'x-user-id header is required' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  async getCart(
    @Headers('x-user-id') userId: string,
  ): Promise<CartResponseDto> {
    if (!userId) {
      throw new BadRequestException('x-user-id header is required');
    }
    return this.cartService.getCart(userId);
  }

  @Post('products')
  @ApiOperation({ summary: 'Add product to cart' })
  @ApiHeader({
    name: 'x-user-id',
    description: 'User identifier',
    required: true,
    example: 'user-123',
  })
  @ApiResponse({
    status: 200,
    description: 'Product added to cart successfully',
    type: CartResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid request or missing header',
  })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  async addProduct(
    @Headers('x-user-id') userId: string,
    @Body() addProductDto: AddProductDto,
  ): Promise<CartResponseDto> {
    if (!userId) {
      throw new BadRequestException('x-user-id header is required');
    }
    return this.cartService.addProduct(userId, addProductDto);
  }

  @Delete('products/:productId')
  @ApiOperation({ summary: 'Remove product from cart' })
  @ApiHeader({
    name: 'x-user-id',
    description: 'User identifier',
    required: true,
    example: 'user-123',
  })
  @ApiParam({
    name: 'productId',
    description: 'Product identifier to remove',
    example: '192663',
  })
  @ApiResponse({
    status: 200,
    description: 'Product removed from cart successfully',
    type: CartResponseDto,
  })
  @ApiResponse({ status: 400, description: 'x-user-id header is required' })
  @ApiResponse({ status: 404, description: 'Product not found in cart' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  async removeProduct(
    @Headers('x-user-id') userId: string,
    @Param('productId') productId: string,
  ): Promise<CartResponseDto> {
    if (!userId) {
      throw new BadRequestException('x-user-id header is required');
    }
    return this.cartService.removeProduct(userId, productId);
  }
}
