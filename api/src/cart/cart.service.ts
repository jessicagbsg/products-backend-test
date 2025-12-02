import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';
import { AxiosError } from 'axios';
import { CartResponseDto } from './dto/cart-response.dto';
import { CartItemDto } from './dto/cart-item.dto';
import { ProductsService } from '../products/products.service';

@Injectable()
export class CartService {
  private readonly cartServiceUrl: string;

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
    private readonly productsService: ProductsService,
  ) {
    this.cartServiceUrl =
      this.configService.get<string>('CART_SERVICE_URL') ?? '';

    this.validateServiceUrl();
  }

  async getCart(userId: string): Promise<CartResponseDto> {
    try {
      const response = await firstValueFrom(
        this.httpService.get<CartResponseDto>(`${this.cartServiceUrl}/cart`, {
          headers: {
            'x-user-id': userId,
          },
        }),
      );
      return response.data;
    } catch (error) {
      this.handleHttpError(error, 'Cart service is unavailable');
    }
  }

  async addProduct(
    userId: string,
    cartItemDto: CartItemDto,
  ): Promise<CartResponseDto> {
    const product = await this.productsService.getProductById(
      cartItemDto.productId,
    );

    const addProductDto = {
      productId: product.productId,
      price: product.price,
      quantity: cartItemDto.quantity,
    };

    try {
      const response = await firstValueFrom(
        this.httpService.post<CartResponseDto>(
          `${this.cartServiceUrl}/cart/products`,
          addProductDto,
          {
            headers: {
              'x-user-id': userId,
            },
          },
        ),
      );
      return response.data;
    } catch (error) {
      this.handleHttpError(error, 'Cart service is unavailable');
    }
  }

  async removeProduct(
    userId: string,
    productId: string,
  ): Promise<CartResponseDto> {
    try {
      const response = await firstValueFrom(
        this.httpService.delete<CartResponseDto>(
          `${this.cartServiceUrl}/cart/products/${productId}`,
          {
            headers: {
              'x-user-id': userId,
            },
          },
        ),
      );
      return response.data;
    } catch (error) {
      this.handleHttpError(error, 'Cart service is unavailable');
    }
  }

  private validateServiceUrl(): void {
    if (!this.cartServiceUrl) {
      throw new HttpException(
        'Cart service URL is not configured',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  private handleHttpError(error: unknown, defaultMessage: string): never {
    if (error instanceof HttpException) {
      throw error;
    }
    if (this.isAxiosError(error)) {
      const message =
        (error.response?.data as { message?: string })?.message ||
        defaultMessage;
      const status = error.response?.status || HttpStatus.INTERNAL_SERVER_ERROR;
      throw new HttpException(message, status);
    }
    throw new HttpException(defaultMessage, HttpStatus.SERVICE_UNAVAILABLE);
  }

  private isAxiosError(error: unknown): error is AxiosError {
    return (
      typeof error === 'object' &&
      error !== null &&
      'response' in error &&
      'isAxiosError' in error
    );
  }
}
