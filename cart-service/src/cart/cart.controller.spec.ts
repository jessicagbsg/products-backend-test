import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException } from '@nestjs/common';
import { CartController } from './cart.controller';
import { CartService } from './cart.service';
import { CartResponseDto } from './dto/cart-response.dto';
import { AddProductDto } from './dto/add-product.dto';

describe('CartController', () => {
  let controller: CartController;
  const mockGetCart = jest.fn<Promise<CartResponseDto>, [string]>();
  const mockAddProduct = jest.fn<
    Promise<CartResponseDto>,
    [string, AddProductDto]
  >();
  const mockRemoveProduct = jest.fn<
    Promise<CartResponseDto>,
    [string, string]
  >();

  const mockCartResponse: CartResponseDto = {
    shoppingCartId: 'cart-uuid-1',
    userId: 'user-123',
    totalPrice: '267.00',
    totalQuantity: 1,
    items: [
      {
        productId: '192663',
        price: '267.00',
        quantity: 1,
      },
    ],
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CartController],
      providers: [
        {
          provide: CartService,
          useValue: {
            getCart: mockGetCart,
            addProduct: mockAddProduct,
            removeProduct: mockRemoveProduct,
          },
        },
      ],
    }).compile();

    controller = module.get<CartController>(CartController);
    mockGetCart.mockClear();
    mockAddProduct.mockClear();
    mockRemoveProduct.mockClear();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getCart', () => {
    it('should return cart when user-id header is provided', async () => {
      mockGetCart.mockResolvedValue(mockCartResponse);

      const result = await controller.getCart('user-123');

      expect(result).toEqual(mockCartResponse);
      expect(mockGetCart).toHaveBeenCalledWith('user-123');
    });

    it('should throw BadRequestException when user-id header is missing', async () => {
      await expect(controller.getCart('')).rejects.toThrow(BadRequestException);
      await expect(controller.getCart('')).rejects.toThrow(
        'x-user-id header is required',
      );
    });
  });

  describe('addProduct', () => {
    const addProductDto: AddProductDto = {
      productId: '192664',
      price: '150.50',
      quantity: 1,
    };

    it('should add product when user-id header is provided', async () => {
      const updatedCart: CartResponseDto = {
        ...mockCartResponse,
        items: [
          ...mockCartResponse.items,
          {
            productId: '192664',
            price: '150.50',
            quantity: 1,
          },
        ],
        totalPrice: '417.50',
        totalQuantity: 2,
      };
      mockAddProduct.mockResolvedValue(updatedCart);

      const result = await controller.addProduct('user-123', addProductDto);

      expect(result).toEqual(updatedCart);
      expect(mockAddProduct).toHaveBeenCalledWith('user-123', addProductDto);
    });

    it('should throw BadRequestException when user-id header is missing', async () => {
      await expect(controller.addProduct('', addProductDto)).rejects.toThrow(
        BadRequestException,
      );
      await expect(controller.addProduct('', addProductDto)).rejects.toThrow(
        'x-user-id header is required',
      );
    });
  });

  describe('removeProduct', () => {
    it('should remove product when user-id header is provided', async () => {
      const updatedCart: CartResponseDto = {
        ...mockCartResponse,
        items: [],
        totalPrice: '0.00',
        totalQuantity: 0,
      };
      mockRemoveProduct.mockResolvedValue(updatedCart);

      const result = await controller.removeProduct('user-123', '192663');

      expect(result).toEqual(updatedCart);
      expect(mockRemoveProduct).toHaveBeenCalledWith('user-123', '192663');
    });

    it('should throw BadRequestException when user-id header is missing', async () => {
      await expect(controller.removeProduct('', '192663')).rejects.toThrow(
        BadRequestException,
      );
      await expect(controller.removeProduct('', '192663')).rejects.toThrow(
        'x-user-id header is required',
      );
    });
  });
});
