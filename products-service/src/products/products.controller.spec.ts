import { Test, TestingModule } from '@nestjs/testing';
import { ProductsController } from './products.controller';
import { ProductsService } from './products.service';
import { ProductDto } from './dto/product.dto';

describe('ProductsController', () => {
  let controller: ProductsController;
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

  const mockFindAll = jest.fn<Promise<ProductDto[]>, []>();

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProductsController],
      providers: [
        {
          provide: ProductsService,
          useValue: {
            findAll: mockFindAll,
          },
        },
      ],
    }).compile();

    controller = module.get<ProductsController>(ProductsController);
    mockFindAll.mockClear();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('findAll', () => {
    it('should return an array of products', async () => {
      mockFindAll.mockResolvedValue(mockProducts);

      const result = await controller.findAll();

      expect(result).toEqual(mockProducts);
      expect(mockFindAll).toHaveBeenCalled();
    });

    it('should return empty array when no products found', async () => {
      mockFindAll.mockResolvedValue([]);

      const result = await controller.findAll();

      expect(result).toEqual([]);
      expect(mockFindAll).toHaveBeenCalled();
    });
  });
});
