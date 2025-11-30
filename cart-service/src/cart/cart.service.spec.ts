import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { NotFoundException } from '@nestjs/common';
import { CartService } from './cart.service';
import { Cart } from './entities/cart.entity';
import { CartItem } from './entities/cart-item.entity';
import { AddProductDto } from './dto/add-product.dto';

describe('CartService', () => {
  let service: CartService;
  let cartRepository: Repository<Cart>;
  let cartItemRepository: Repository<CartItem>;

  const mockCart: Cart = {
    id: 'cart-uuid-1',
    userId: 'user-123',
    totalPrice: '267.00',
    totalQuantity: 1,
    items: [
      {
        id: 'item-uuid-1',
        productId: '192663',
        price: '267.00',
        quantity: 1,
        cartId: 'cart-uuid-1',
        cart: {} as Cart,
        createdAt: new Date(),
        updatedAt: new Date(),
      } as CartItem,
    ],
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockEmptyCart: Cart = {
    id: 'cart-uuid-2',
    userId: 'user-456',
    totalPrice: '0.00',
    totalQuantity: 0,
    items: [],
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CartService,
        {
          provide: getRepositoryToken(Cart),
          useValue: {
            findOne: jest.fn(),
            create: jest.fn(),
            save: jest.fn(),
          },
        },
        {
          provide: getRepositoryToken(CartItem),
          useValue: {
            create: jest.fn(),
            save: jest.fn(),
            remove: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<CartService>(CartService);
    cartRepository = module.get<Repository<Cart>>(getRepositoryToken(Cart));
    cartItemRepository = module.get<Repository<CartItem>>(
      getRepositoryToken(CartItem),
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getCart', () => {
    it('should return existing cart', async () => {
      const findOneSpy = jest
        .spyOn(cartRepository, 'findOne')
        .mockResolvedValue(mockCart);

      const result = await service.getCart('user-123');

      expect(result).toEqual({
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
      });
      expect(findOneSpy).toHaveBeenCalledWith({
        where: { userId: 'user-123' },
        relations: ['items'],
      });
    });

    it('should create new cart if not exists', async () => {
      jest.spyOn(cartRepository, 'findOne').mockResolvedValue(null);
      const createSpy = jest
        .spyOn(cartRepository, 'create')
        .mockReturnValue(mockEmptyCart);
      const saveSpy = jest
        .spyOn(cartRepository, 'save')
        .mockResolvedValue(mockEmptyCart);

      const result = await service.getCart('user-456');

      expect(result).toEqual({
        shoppingCartId: 'cart-uuid-2',
        userId: 'user-456',
        totalPrice: '0.00',
        totalQuantity: 0,
        items: [],
      });

      expect(createSpy).toHaveBeenCalled();
      expect(saveSpy).toHaveBeenCalled();
    });
  });

  describe('addProduct', () => {
    it('should add new product to cart', async () => {
      const addProductDto: AddProductDto = {
        productId: '192664',
        price: '150.50',
        quantity: 1,
      };

      jest.spyOn(cartRepository, 'findOne').mockResolvedValue(mockEmptyCart);
      const newItem = {
        id: 'item-uuid-2',
        productId: '192664',
        price: '150.50',
        quantity: 1,
        cartId: 'cart-uuid-2',
        cart: mockEmptyCart,
        createdAt: new Date(),
        updatedAt: new Date(),
      } as CartItem;

      jest.spyOn(cartItemRepository, 'create').mockReturnValue(newItem);
      jest.spyOn(cartItemRepository, 'save').mockResolvedValue(newItem);

      const updatedCart = {
        ...mockEmptyCart,
        items: [newItem],
        totalPrice: '150.50',
        totalQuantity: 1,
      };
      jest.spyOn(cartRepository, 'save').mockResolvedValue(updatedCart);

      const result = await service.addProduct('user-456', addProductDto);

      expect(result.items).toHaveLength(1);
      expect(result.items[0].productId).toBe('192664');
      expect(result.totalPrice).toBe('150.50');
      expect(result.totalQuantity).toBe(1);
    });

    it('should increment quantity if product already exists', async () => {
      const addProductDto: AddProductDto = {
        productId: '192663',
        price: '267.00',
        quantity: 1,
      };

      jest.spyOn(cartRepository, 'findOne').mockResolvedValue(mockCart);
      const updatedItem = {
        ...mockCart.items[0],
        quantity: 2,
      };
      jest.spyOn(cartItemRepository, 'save').mockResolvedValue(updatedItem);

      const updatedCart = {
        ...mockCart,
        items: [updatedItem],
        totalPrice: '534.00',
        totalQuantity: 2,
      };
      jest.spyOn(cartRepository, 'save').mockResolvedValue(updatedCart);

      const result = await service.addProduct('user-123', addProductDto);

      expect(result.items[0].quantity).toBe(2);
      expect(result.totalPrice).toBe('534.00');
      expect(result.totalQuantity).toBe(2);
    });
  });

  describe('removeProduct', () => {
    it('should throw NotFoundException if cart not found', async () => {
      jest.spyOn(cartRepository, 'findOne').mockResolvedValue(null);

      await expect(service.removeProduct('user-999', '192663')).rejects.toThrow(
        NotFoundException,
      );
      await expect(service.removeProduct('user-999', '192663')).rejects.toThrow(
        'Cart not found',
      );
    });

    it('should throw NotFoundException if product not in cart', async () => {
      jest.spyOn(cartRepository, 'findOne').mockResolvedValue(mockCart);

      await expect(
        service.removeProduct('user-123', 'non-existent'),
      ).rejects.toThrow(NotFoundException);
      await expect(
        service.removeProduct('user-123', 'non-existent'),
      ).rejects.toThrow('Product not found in cart');
    });

    it('should decrement quantity if quantity > 1', async () => {
      const cartWithMultipleQuantity = {
        ...mockCart,
        items: [
          {
            ...mockCart.items[0],
            quantity: 2,
          },
        ],
        totalPrice: '534.00',
        totalQuantity: 2,
      };

      jest
        .spyOn(cartRepository, 'findOne')
        .mockResolvedValue(cartWithMultipleQuantity);

      const updatedItem = {
        ...cartWithMultipleQuantity.items[0],
        quantity: 1,
      };
      jest.spyOn(cartItemRepository, 'save').mockResolvedValue(updatedItem);

      const updatedCart = {
        ...cartWithMultipleQuantity,
        items: [updatedItem],
        totalPrice: '267.00',
        totalQuantity: 1,
      };
      jest.spyOn(cartRepository, 'save').mockResolvedValue(updatedCart);

      const result = await service.removeProduct('user-123', '192663');

      expect(result.items[0].quantity).toBe(1);
      expect(result.totalPrice).toBe('267.00');
      expect(result.totalQuantity).toBe(1);
    });

    it('should remove item if quantity = 1', async () => {
      const cartWithItem: Cart = {
        ...mockCart,
        items: [
          {
            id: 'item-uuid-1',
            productId: '192663',
            price: '267.00',
            quantity: 1,
            cartId: 'cart-uuid-1',
            cart: {} as Cart,
            createdAt: new Date(),
            updatedAt: new Date(),
          } as CartItem,
        ],
      };

      jest.spyOn(cartRepository, 'findOne').mockResolvedValue(cartWithItem);
      const removeSpy = jest
        .spyOn(cartItemRepository, 'remove')
        .mockResolvedValue(cartWithItem.items[0]);
      jest.spyOn(cartRepository, 'save').mockImplementation((cart: Cart) => {
        return Promise.resolve(cart);
      });

      const result = await service.removeProduct('user-123', '192663');

      expect(result.items).toHaveLength(0);
      expect(result.totalPrice).toBe('0.00');
      expect(result.totalQuantity).toBe(0);
      expect(removeSpy).toHaveBeenCalled();
    });
  });
});
