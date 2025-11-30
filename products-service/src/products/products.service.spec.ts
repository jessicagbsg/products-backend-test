import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { Model, Query } from 'mongoose';
import { ProductsService } from './products.service';
import { Product, ProductDocument } from './schemas/product.schema';

describe('ProductsService', () => {
  let service: ProductsService;
  let model: Model<ProductDocument>;

  const mockProducts: ProductDocument[] = [
    {
      productId: '192663',
      price: '267.00',
    } as ProductDocument,
    {
      productId: '192664',
      price: '150.50',
    } as ProductDocument,
  ];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductsService,
        {
          provide: getModelToken(Product.name),
          useValue: {
            find: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<ProductsService>(ProductsService);
    model = module.get<Model<ProductDocument>>(getModelToken(Product.name));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should return an array of products', async () => {
      const mockExec = jest
        .fn<Promise<ProductDocument[]>, []>()
        .mockResolvedValue(mockProducts);
      const mockQuery = {
        exec: mockExec,
      } as unknown as Query<ProductDocument[], ProductDocument>;

      const findSpy = jest.spyOn(model, 'find').mockReturnValue(mockQuery);

      const result = await service.findAll();

      expect(result).toEqual([
        { productId: '192663', price: '267.00' },
        { productId: '192664', price: '150.50' },
      ]);
      expect(findSpy).toHaveBeenCalled();
      expect(mockExec).toHaveBeenCalled();
    });

    it('should return empty array when no products found', async () => {
      const mockExec = jest
        .fn<Promise<ProductDocument[]>, []>()
        .mockResolvedValue([]);
      const mockQuery = {
        exec: mockExec,
      } as unknown as Query<ProductDocument[], ProductDocument>;

      const findSpy = jest.spyOn(model, 'find').mockReturnValue(mockQuery);

      const result = await service.findAll();

      expect(result).toEqual([]);
      expect(findSpy).toHaveBeenCalled();
    });

    it('should map products to ProductDto format', async () => {
      const dbProducts: ProductDocument[] = [
        {
          productId: '192663',
          price: '267.99',
        } as ProductDocument,
      ];

      const mockExec = jest
        .fn<Promise<ProductDocument[]>, []>()
        .mockResolvedValue(dbProducts);
      const mockQuery = {
        exec: mockExec,
      } as unknown as Query<ProductDocument[], ProductDocument>;

      const findSpy = jest.spyOn(model, 'find').mockReturnValue(mockQuery);

      const result = await service.findAll();

      expect(result).toEqual([
        {
          productId: '192663',
          price: '267.99',
        },
      ]);
      expect(result[0]).not.toHaveProperty('_id');
      expect(result[0]).not.toHaveProperty('createdAt');
      expect(findSpy).toHaveBeenCalled();
    });
  });
});
