import { Controller, Get, Post, Delete, Param, Body } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { CartService } from './cart.service';
import { CartResponseDto } from './dto/cart-response.dto';
import { CartItemDto } from './dto/cart-item.dto';
import { ProductIdParam } from './dto/product-id-param.dto';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

// In a production environment, I would apply the @ApiBearerAuth decorator only to
// a "checkout" endpoint to allow the user to checkout without being authenticated,
// and the other endpoints to be public.
@ApiTags('cart')
@ApiBearerAuth('JWT-auth')
@Controller({ path: 'cart', version: '1' })
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Get()
  @ApiOperation({ summary: 'Get user cart' })
  @ApiResponse({
    status: 200,
    description: 'Cart retrieved successfully',
    type: CartResponseDto,
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 503, description: 'Cart service unavailable' })
  async getCart(@CurrentUser() userId: string): Promise<CartResponseDto> {
    return this.cartService.getCart(userId);
  }

  @Post('products')
  @ApiOperation({ summary: 'Add product to cart' })
  @ApiResponse({
    status: 200,
    description: 'Product added to cart successfully',
    type: CartResponseDto,
  })
  @ApiResponse({ status: 400, description: 'Invalid request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Product not found' })
  @ApiResponse({ status: 503, description: 'Service unavailable' })
  async addProduct(
    @CurrentUser() userId: string,
    @Body() cartItemDto: CartItemDto,
  ): Promise<CartResponseDto> {
    return this.cartService.addProduct(userId, cartItemDto);
  }

  @Delete('products/:productId')
  @ApiOperation({ summary: 'Remove product from cart' })
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
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Product not found in cart' })
  @ApiResponse({ status: 503, description: 'Cart service unavailable' })
  async removeProduct(
    @CurrentUser() userId: string,
    @Param() params: ProductIdParam,
  ): Promise<CartResponseDto> {
    return this.cartService.removeProduct(userId, params.productId);
  }
}
