import { Controller, Get, Post, Delete, Param, Body } from '@nestjs/common';
import { CartService } from './cart.service';
import { CartResponseDto } from './dto/cart-response.dto';
import { CartItemDto } from './dto/cart-item.dto';
import { ProductIdParam } from './dto/product-id-param.dto';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

@Controller({ path: 'cart', version: '1' })
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Get()
  async getCart(@CurrentUser() userId: string): Promise<CartResponseDto> {
    return this.cartService.getCart(userId);
  }

  @Post('products')
  async addProduct(
    @CurrentUser() userId: string,
    @Body() cartItemDto: CartItemDto,
  ): Promise<CartResponseDto> {
    return this.cartService.addProduct(userId, cartItemDto);
  }

  @Delete('products/:productId')
  async removeProduct(
    @CurrentUser() userId: string,
    @Param() params: ProductIdParam,
  ): Promise<CartResponseDto> {
    return this.cartService.removeProduct(userId, params.productId);
  }
}
