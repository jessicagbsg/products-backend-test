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
import { CartService } from './cart.service';
import { AddProductDto } from './dto/add-product.dto';
import { CartResponseDto } from './dto/cart-response.dto';

@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Get()
  async getCart(
    @Headers('x-user-id') userId: string,
  ): Promise<CartResponseDto> {
    if (!userId) {
      throw new BadRequestException('x-user-id header is required');
    }
    return this.cartService.getCart(userId);
  }

  @Post('products')
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
