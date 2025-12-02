import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';
import { ProductDto } from './dto/product.dto';

@Injectable()
export class ProductsService {
  private readonly productsServiceUrl: string;

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {
    this.productsServiceUrl =
      this.configService.get<string>('PRODUCTS_SERVICE_URL') ?? '';
  }

  async getProducts(): Promise<ProductDto[]> {
    if (!this.productsServiceUrl) {
      throw new HttpException(
        'Products service URL is not configured',
        HttpStatus.BAD_REQUEST,
      );
    }

    try {
      const response = await firstValueFrom(
        this.httpService.get<ProductDto[]>(
          `${this.productsServiceUrl}/products`,
        ),
      );
      return response.data;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        'Products service is unavailable',
        HttpStatus.SERVICE_UNAVAILABLE,
      );
    }
  }

  async getProductById(productId: string): Promise<ProductDto> {
    if (!this.productsServiceUrl) {
      throw new HttpException(
        'Products service URL is not configured',
        HttpStatus.BAD_REQUEST,
      );
    }

    try {
      const products = await this.getProducts();
      const product = products.find((p) => p.productId === productId);

      if (!product) {
        throw new HttpException(
          `Product with id ${productId} not found`,
          HttpStatus.NOT_FOUND,
        );
      }

      return product;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        'Products service is unavailable',
        HttpStatus.SERVICE_UNAVAILABLE,
      );
    }
  }
}
