import { Test, TestingModule } from '@nestjs/testing';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { HttpException, HttpStatus } from '@nestjs/common';
import { of, throwError } from 'rxjs';
import { ProductsService } from './products.service';
import { ProductDto } from './dto/product.dto';
import { AxiosError, AxiosResponse } from 'axios';

describe('ProductsService', () => {
  let service: ProductsService;
  let httpService: HttpService;

  const mockProducts: ProductDto[] = [
    {
      productId: '192663',
      price: '267.00',
    },
    {
      productId: '192664',
      price: '150.50',
    },
  ];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductsService,
        {
          provide: HttpService,
          useValue: {
            get: jest.fn(),
          },
        },
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn().mockReturnValue('http://products-service:3001'),
          },
        },
      ],
    }).compile();

    service = module.get<ProductsService>(ProductsService);
    httpService = module.get<HttpService>(HttpService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getProducts', () => {
    it('should return an array of products', async () => {
      const getProductsSpy = jest.spyOn(httpService, 'get').mockReturnValue(
        of({
          data: mockProducts,
        } as AxiosResponse<ProductDto[]>),
      );

      const result = await service.getProducts();

      expect(result).toEqual(mockProducts);
      expect(getProductsSpy).toHaveBeenCalledWith(
        'http://products-service:3001/products',
      );
    });

    it('should throw HttpException when products service URL is not configured', async () => {
      const moduleWithoutUrl: TestingModule = await Test.createTestingModule({
        providers: [
          ProductsService,
          {
            provide: HttpService,
            useValue: {
              get: jest.fn(),
            },
          },
          {
            provide: ConfigService,
            useValue: {
              get: jest.fn().mockReturnValue(''),
            },
          },
        ],
      }).compile();

      const serviceWithoutUrl =
        moduleWithoutUrl.get<ProductsService>(ProductsService);

      await expect(serviceWithoutUrl.getProducts()).rejects.toThrow(
        HttpException,
      );
      await expect(serviceWithoutUrl.getProducts()).rejects.toThrow(
        'Products service URL is not configured',
      );
    });

    it('should throw HttpException when products service is unavailable', async () => {
      const axiosError = {
        isAxiosError: true,
        response: {
          status: 500,
          data: { message: 'Internal server error' },
        },
      } as AxiosError;

      jest
        .spyOn(httpService, 'get')
        .mockReturnValue(throwError(() => axiosError));

      await expect(service.getProducts()).rejects.toThrow(HttpException);
      await expect(service.getProducts()).rejects.toThrow(
        'Products service is unavailable',
      );
    });

    it('should re-throw HttpException when error is HttpException', async () => {
      const httpException = new HttpException(
        'Custom error',
        HttpStatus.BAD_REQUEST,
      );

      jest
        .spyOn(httpService, 'get')
        .mockReturnValue(throwError(() => httpException));

      await expect(service.getProducts()).rejects.toThrow(HttpException);
      await expect(service.getProducts()).rejects.toThrow('Custom error');
    });
  });

  describe('getProductById', () => {
    it('should return a product by id', async () => {
      jest.spyOn(httpService, 'get').mockReturnValue(
        of({
          data: mockProducts,
        } as AxiosResponse<ProductDto[]>),
      );

      const result = await service.getProductById('192663');

      expect(result).toEqual(mockProducts[0]);
      expect(result.productId).toBe('192663');
    });

    it('should throw HttpException when product not found', async () => {
      jest.spyOn(httpService, 'get').mockReturnValue(
        of({
          data: mockProducts,
        } as AxiosResponse<ProductDto[]>),
      );

      await expect(service.getProductById('999999')).rejects.toThrow(
        HttpException,
      );
      await expect(service.getProductById('999999')).rejects.toThrow(
        'Product with id 999999 not found',
      );
    });

    it('should throw HttpException when products service URL is not configured', async () => {
      const moduleWithoutUrl: TestingModule = await Test.createTestingModule({
        providers: [
          ProductsService,
          {
            provide: HttpService,
            useValue: {
              get: jest.fn(),
            },
          },
          {
            provide: ConfigService,
            useValue: {
              get: jest.fn().mockReturnValue(''),
            },
          },
        ],
      }).compile();

      const serviceWithoutUrl =
        moduleWithoutUrl.get<ProductsService>(ProductsService);

      await expect(serviceWithoutUrl.getProductById('192663')).rejects.toThrow(
        HttpException,
      );
    });

    it('should throw HttpException when products service is unavailable', async () => {
      const axiosError = {
        isAxiosError: true,
        response: {
          status: 500,
          data: { message: 'Internal server error' },
        },
      } as AxiosError;

      jest
        .spyOn(httpService, 'get')
        .mockReturnValue(throwError(() => axiosError));

      await expect(service.getProductById('192663')).rejects.toThrow(
        HttpException,
      );
    });
  });
});
