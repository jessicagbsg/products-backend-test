import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class HealthService {
  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {}

  async check() {
    const productsServiceUrl =
      this.configService.get<string>('PRODUCTS_SERVICE_URL') ?? '';
    const cartServiceUrl =
      this.configService.get<string>('CART_SERVICE_URL') ?? '';

    let productsServiceStatus = 'unknown';
    let cartServiceStatus = 'unknown';

    // Check products service
    if (productsServiceUrl) {
      try {
        await firstValueFrom(
          this.httpService.get(`${productsServiceUrl}/health`, {
            timeout: 2000,
          }),
        );
        productsServiceStatus = 'ok';
      } catch {
        productsServiceStatus = 'error';
      }
    }

    // Check cart service
    if (cartServiceUrl) {
      try {
        await firstValueFrom(
          this.httpService.get(`${cartServiceUrl}/health`, {
            timeout: 2000,
          }),
        );
        cartServiceStatus = 'ok';
      } catch {
        cartServiceStatus = 'error';
      }
    }

    const overallStatus =
      productsServiceStatus === 'ok' && cartServiceStatus === 'ok'
        ? 'ok'
        : 'degraded';

    return {
      status: overallStatus,
      timestamp: new Date().toISOString(),
      service: 'api-gateway',
      dependencies: {
        productsService: {
          status: productsServiceStatus,
          url: productsServiceUrl || 'not configured',
        },
        cartService: {
          status: cartServiceStatus,
          url: cartServiceUrl || 'not configured',
        },
      },
    };
  }
}
