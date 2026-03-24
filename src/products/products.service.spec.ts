import { Test, TestingModule } from '@nestjs/testing';
import { ConflictException, NotFoundException } from '@nestjs/common';
import { getRepositoryToken } from '@nestjs/typeorm';
import { QueryFailedError } from 'typeorm';
import { ProductsService } from './products.service';
import { Product } from './entities/product.entity';

describe('ProductsService', () => {
  let service: ProductsService;
  let repository: {
    create: jest.Mock;
    save: jest.Mock;
    find: jest.Mock;
    findOneBy: jest.Mock;
    delete: jest.Mock;
  };

  const buildProduct = (): Product => ({
    id: '87a56cd1-4f8c-4cb7-b50a-5da83944cbf4',
    name: 'Camiseta Azul',
    price: 49.9,
    sku: 'CAM',
  });

  beforeEach(async () => {
    repository = {
      create: jest.fn(),
      save: jest.fn(),
      find: jest.fn(),
      findOneBy: jest.fn(),
      delete: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductsService,
        {
          provide: getRepositoryToken(Product),
          useValue: repository,
        },
      ],
    }).compile();

    service = module.get<ProductsService>(ProductsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('creates a product and returns the computed missing letter', async () => {
    const product = buildProduct();

    repository.create.mockReturnValue(product);
    repository.save.mockResolvedValue(product);

    const result = await service.create({
      name: product.name,
      price: product.price,
      sku: product.sku,
    });

    expect(repository.create).toHaveBeenCalledWith({
      name: product.name,
      price: product.price,
      sku: product.sku,
    });
    expect(result).toEqual({
      ...product,
      missingLetter: 'b',
    });
  });

  it('lists products ordered by name and with missingLetter in camelCase', async () => {
    const product = buildProduct();

    repository.find.mockResolvedValue([product]);

    const result = await service.findAll();

    expect(repository.find).toHaveBeenCalledWith({
      order: {
        name: 'ASC',
      },
    });
    expect(result).toEqual([
      {
        ...product,
        missingLetter: 'b',
      },
    ]);
  });

  it('throws not found when searching for an unknown product', async () => {
    const product = buildProduct();

    repository.findOneBy.mockResolvedValue(null);

    await expect(service.findOne(product.id)).rejects.toBeInstanceOf(
      NotFoundException,
    );
  });

  it('updates an existing product and keeps the API response format', async () => {
    const product = buildProduct();
    const updatedProduct = {
      ...product,
      name: 'Bermuda Preta',
      sku: 'BER',
    };

    repository.findOneBy.mockResolvedValue(product);
    repository.save.mockResolvedValue(updatedProduct);

    const result = await service.update(product.id, {
      name: updatedProduct.name,
      sku: updatedProduct.sku,
    });

    expect(repository.save).toHaveBeenCalledWith({
      ...product,
      name: updatedProduct.name,
      price: product.price,
      sku: updatedProduct.sku,
    });
    expect(result).toEqual({
      ...updatedProduct,
      missingLetter: 'a',
    });
  });

  it('translates SQLite unique errors into conflict exceptions', async () => {
    const product = buildProduct();

    repository.create.mockReturnValue(product);
    repository.save.mockRejectedValue(
      new QueryFailedError('INSERT INTO products', [], {
        code: 'SQLITE_CONSTRAINT_UNIQUE',
      }),
    );

    await expect(
      service.create({
        name: product.name,
        price: product.price,
        sku: product.sku,
      }),
    ).rejects.toBeInstanceOf(ConflictException);
  });

  it('throws not found when deleting an unknown product', async () => {
    const product = buildProduct();

    repository.delete.mockResolvedValue({ affected: 0 });

    await expect(service.remove(product.id)).rejects.toBeInstanceOf(
      NotFoundException,
    );
  });
});
