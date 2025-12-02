import { Test, TestingModule } from '@nestjs/testing';
import { ProductsController } from './products.controller';
import { ProductsService } from './products.service';
import { ProductDto } from './dto/product.dto';

describe('ProductsController', () => {
  let controller: ProductsController;
  let productsService: ProductsService;

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
      controllers: [ProductsController],
      providers: [
        {
          provide: ProductsService,
          useValue: {
            getProducts: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<ProductsController>(ProductsController);
    productsService = module.get<ProductsService>(ProductsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('findAll', () => {
    it('should return an array of products', async () => {
      const getProductsSpy = jest
        .spyOn(productsService, 'getProducts')
        .mockResolvedValue(mockProducts);

      const result = await controller.findAll();

      expect(result).toEqual(mockProducts);
      expect(getProductsSpy).toHaveBeenCalled();
    });

    it('should return empty array when no products found', async () => {
      const getProductsSpy = jest
        .spyOn(productsService, 'getProducts')
        .mockResolvedValue([]);

      const result = await controller.findAll();

      expect(result).toEqual([]);
      expect(getProductsSpy).toHaveBeenCalled();
    });
  });
});
