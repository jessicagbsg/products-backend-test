import { Test, TestingModule } from '@nestjs/testing';
import { CartController } from './cart.controller';
import { CartService } from './cart.service';
import { CartResponseDto } from './dto/cart-response.dto';
import { CartItemDto } from './dto/cart-item.dto';

describe('CartController', () => {
  let controller: CartController;
  let cartService: CartService;

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

  const mockCartItemDto: CartItemDto = {
    productId: '192663',
    quantity: 2,
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CartController],
      providers: [
        {
          provide: CartService,
          useValue: {
            getCart: jest.fn(),
            addProduct: jest.fn(),
            removeProduct: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<CartController>(CartController);
    cartService = module.get<CartService>(CartService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getCart', () => {
    it('should return a cart', async () => {
      const getCartSpy = jest
        .spyOn(cartService, 'getCart')
        .mockResolvedValue(mockCartResponse);

      const result = await controller.getCart('user-123');

      expect(result).toEqual(mockCartResponse);
      expect(getCartSpy).toHaveBeenCalledWith('user-123');
    });
  });

  describe('addProduct', () => {
    it('should add a product to the cart', async () => {
      const addProductSpy = jest
        .spyOn(cartService, 'addProduct')
        .mockResolvedValue(mockCartResponse);

      const result = await controller.addProduct('user-123', mockCartItemDto);

      expect(result).toEqual(mockCartResponse);
      expect(addProductSpy).toHaveBeenCalledWith('user-123', mockCartItemDto);
    });
  });

  describe('removeProduct', () => {
    it('should remove a product from the cart', async () => {
      const removeProductSpy = jest
        .spyOn(cartService, 'removeProduct')
        .mockResolvedValue(mockCartResponse);

      const result = await controller.removeProduct('user-123', {
        productId: '192663',
      });

      expect(result).toEqual(mockCartResponse);
      expect(removeProductSpy).toHaveBeenCalledWith('user-123', '192663');
    });
  });
});
