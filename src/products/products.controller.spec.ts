import { Test, TestingModule } from '@nestjs/testing';
import { ProductsController } from './products.controller';
import { ProductsService } from './products.service';

describe('ProductsController', () => {
  let controller: ProductsController;
  let productsService: {
    create: jest.Mock;
    findAll: jest.Mock;
    findOne: jest.Mock;
    update: jest.Mock;
    remove: jest.Mock;
  };

  beforeEach(async () => {
    productsService = {
      create: jest.fn(),
      findAll: jest.fn(),
      findOne: jest.fn(),
      update: jest.fn(),
      remove: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProductsController],
      providers: [
        {
          provide: ProductsService,
          useValue: productsService,
        },
      ],
    }).compile();

    controller = module.get<ProductsController>(ProductsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('delegates product creation to the service', async () => {
    const dto = {
      name: 'Camiseta Azul',
      price: 49.9,
      sku: 'CAM',
    };
    const response = {
      id: '87a56cd1-4f8c-4cb7-b50a-5da83944cbf4',
      ...dto,
      missingLetter: 'b',
    };

    productsService.create.mockResolvedValue(response);

    await expect(controller.create(dto)).resolves.toEqual(response);
    expect(productsService.create).toHaveBeenCalledWith(dto);
  });

  it('delegates updates using the route id and body payload', async () => {
    const id = '87a56cd1-4f8c-4cb7-b50a-5da83944cbf4';
    const dto = {
      name: 'Bermuda Preta',
      price: 79.9,
      sku: 'BER',
    };

    productsService.update.mockResolvedValue({
      id,
      ...dto,
      missingLetter: 'a',
    });

    await controller.update(id, dto);

    expect(productsService.update).toHaveBeenCalledWith(id, dto);
  });
});
