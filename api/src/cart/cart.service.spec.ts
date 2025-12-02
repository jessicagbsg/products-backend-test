import { Test, TestingModule } from '@nestjs/testing';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { HttpException, HttpStatus } from '@nestjs/common';
import { of, throwError } from 'rxjs';
import { AxiosError, AxiosResponse } from 'axios';
import { CartService } from './cart.service';
import { ProductsService } from '../products/products.service';
import { CartResponseDto } from './dto/cart-response.dto';
import { CartItemDto } from './dto/cart-item.dto';
import { ProductDto } from '../products/dto/product.dto';

describe('CartService', () => {
  let service: CartService;
  let httpService: HttpService;
  let productsService: ProductsService;

  const mockCartResponse: CartResponseDto = {
    shoppingCartId: 'cart-123',
    userId: 'user-123',
    totalPrice: '267.00',
    totalQuantity: 1,
    items: [
      {
        productId: '192663',
        quantity: 1,
      },
    ],
  };

  const mockProduct: ProductDto = {
    productId: '192663',
    price: '267.00',
  };

  const mockCartItemDto: CartItemDto = {
    productId: '192663',
    quantity: 2,
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CartService,
        {
          provide: HttpService,
          useValue: {
            get: jest.fn(),
            post: jest.fn(),
            delete: jest.fn(),
          },
        },
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn().mockReturnValue('http://cart-service:3002'),
          },
        },
        {
          provide: ProductsService,
          useValue: {
            getProductById: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<CartService>(CartService);
    httpService = module.get<HttpService>(HttpService);
    productsService = module.get<ProductsService>(ProductsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getCart', () => {
    it('should return a cart', async () => {
      const getCartSpy = jest.spyOn(httpService, 'get').mockReturnValue(
        of({
          data: mockCartResponse,
        } as AxiosResponse<CartResponseDto>),
      );

      const result = await service.getCart('user-123');

      expect(result).toEqual(mockCartResponse);
      expect(getCartSpy).toHaveBeenCalledWith('http://cart-service:3002/cart', {
        headers: {
          'x-user-id': 'user-123',
        },
      });
    });

    it('should throw HttpException when cart service is unavailable', async () => {
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

      await expect(service.getCart('user-123')).rejects.toThrow(HttpException);
    });

    it('should re-throw HttpException when error is HttpException', async () => {
      const httpException = new HttpException(
        'Custom error',
        HttpStatus.BAD_REQUEST,
      );

      jest
        .spyOn(httpService, 'get')
        .mockReturnValue(throwError(() => httpException));

      await expect(service.getCart('user-123')).rejects.toThrow(HttpException);
    });
  });

  describe('addProduct', () => {
    it('should add a product to cart', async () => {
      const getProductByIdSpy = jest
        .spyOn(productsService, 'getProductById')
        .mockResolvedValue(mockProduct);
      const addProductSpy = jest.spyOn(httpService, 'post').mockReturnValue(
        of({
          data: mockCartResponse,
        } as AxiosResponse<CartResponseDto>),
      );

      const result = await service.addProduct('user-123', mockCartItemDto);

      expect(result).toEqual(mockCartResponse);
      expect(getProductByIdSpy).toHaveBeenCalledWith('192663');
      expect(addProductSpy).toHaveBeenCalledWith(
        'http://cart-service:3002/cart/products',
        {
          productId: '192663',
          price: '267.00',
          quantity: 2,
        },
        {
          headers: {
            'x-user-id': 'user-123',
          },
        },
      );
    });

    it('should throw HttpException when product not found', async () => {
      const getProductByIdSpy = jest
        .spyOn(productsService, 'getProductById')
        .mockRejectedValue(
          new HttpException('Product not found', HttpStatus.NOT_FOUND),
        );
      const addProductSpy = jest.spyOn(httpService, 'post').mockReturnValue(
        of({
          data: mockCartResponse,
        } as AxiosResponse<CartResponseDto>),
      );

      await expect(
        service.addProduct('user-123', mockCartItemDto),
      ).rejects.toThrow(HttpException);
      expect(getProductByIdSpy).toHaveBeenCalledWith('192663');
      expect(addProductSpy).not.toHaveBeenCalled();
    });

    it('should throw HttpException when products service is unavailable', async () => {
      jest
        .spyOn(productsService, 'getProductById')
        .mockRejectedValue(
          new HttpException(
            'Products service is unavailable',
            HttpStatus.SERVICE_UNAVAILABLE,
          ),
        );

      await expect(
        service.addProduct('user-123', mockCartItemDto),
      ).rejects.toThrow(HttpException);
    });

    it('should throw HttpException when cart service is unavailable', async () => {
      jest
        .spyOn(productsService, 'getProductById')
        .mockResolvedValue(mockProduct);

      const axiosError = {
        isAxiosError: true,
        response: {
          status: 500,
          data: { message: 'Internal server error' },
        },
      } as AxiosError;

      jest
        .spyOn(httpService, 'post')
        .mockReturnValue(throwError(() => axiosError));

      await expect(
        service.addProduct('user-123', mockCartItemDto),
      ).rejects.toThrow(HttpException);
    });
  });

  describe('removeProduct', () => {
    it('should remove a product from cart', async () => {
      const removeProductSpy = jest
        .spyOn(httpService, 'delete')
        .mockReturnValue(
          of({
            data: mockCartResponse,
          } as AxiosResponse<CartResponseDto>),
        );

      const result = await service.removeProduct('user-123', '192663');

      expect(result).toEqual(mockCartResponse);
      expect(removeProductSpy).toHaveBeenCalledWith(
        'http://cart-service:3002/cart/products/192663',
        {
          headers: {
            'x-user-id': 'user-123',
          },
        },
      );
    });

    it('should throw HttpException when cart service is unavailable', async () => {
      const axiosError = {
        isAxiosError: true,
        response: {
          status: 500,
          data: { message: 'Internal server error' },
        },
      } as AxiosError;

      jest
        .spyOn(httpService, 'delete')
        .mockReturnValue(throwError(() => axiosError));

      await expect(service.removeProduct('user-123', '192663')).rejects.toThrow(
        HttpException,
      );
    });

    it('should re-throw HttpException when error is HttpException', async () => {
      const httpException = new HttpException(
        'Custom error',
        HttpStatus.BAD_REQUEST,
      );

      jest
        .spyOn(httpService, 'delete')
        .mockReturnValue(throwError(() => httpException));

      await expect(service.removeProduct('user-123', '192663')).rejects.toThrow(
        HttpException,
      );
    });
  });
});
