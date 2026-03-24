import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { configureApp } from './../src/app.setup';

type ProductResponseBody = {
  id: string;
  name: string;
  price: number;
  sku: string;
  missingLetter: string;
};

type ValidationErrorBody = {
  message: string[];
};

describe('Products API (e2e)', () => {
  let app: INestApplication;
  let httpServer: Parameters<typeof request>[0];
  const originalEnv = {
    DATABASE_PATH: process.env.DATABASE_PATH,
    DB_SYNCHRONIZE: process.env.DB_SYNCHRONIZE,
    NODE_ENV: process.env.NODE_ENV,
  };

  beforeAll(async () => {
    process.env.DATABASE_PATH = ':memory:';
    process.env.DB_SYNCHRONIZE = 'true';
    process.env.NODE_ENV = 'test';

    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    configureApp(app);
    await app.init();
    httpServer = app.getHttpServer() as Parameters<typeof request>[0];
  });

  afterAll(async () => {
    await app.close();

    process.env.DATABASE_PATH = originalEnv.DATABASE_PATH;
    process.env.DB_SYNCHRONIZE = originalEnv.DB_SYNCHRONIZE;
    process.env.NODE_ENV = originalEnv.NODE_ENV;
  });

  it('creates, lists, updates and deletes a product', async () => {
    const createResponse = await request(httpServer)
      .post('/products')
      .send({
        name: 'Camiseta Azul',
        price: 49.9,
        sku: 'cam',
      })
      .expect(201);

    const createBody = createResponse.body as ProductResponseBody;

    expect(createBody).toMatchObject({
      name: 'Camiseta Azul',
      price: 49.9,
      sku: 'CAM',
      missingLetter: 'b',
    });
    expect(createBody.id).toEqual(expect.any(String));

    const productId = createBody.id;

    const listResponse = await request(httpServer).get('/products').expect(200);
    const listBody = listResponse.body as ProductResponseBody[];

    expect(listBody).toEqual([
      expect.objectContaining({
        id: productId,
        name: 'Camiseta Azul',
        sku: 'CAM',
        missingLetter: 'b',
      }),
    ]);

    const updateResponse = await request(httpServer)
      .put(`/products/${productId}`)
      .send({
        name: 'Bermuda Preta',
        price: 79.9,
        sku: 'BER',
      })
      .expect(200);
    const updateBody = updateResponse.body as ProductResponseBody;

    expect(updateBody).toMatchObject({
      id: productId,
      name: 'Bermuda Preta',
      sku: 'BER',
      missingLetter: 'c',
    });

    await request(httpServer)
      .delete(`/products/${productId}`)
      .expect(200)
      .expect({
        message: 'Produto removido com sucesso.',
      });
  });

  it('rejects invalid payloads and duplicate SKUs', async () => {
    await request(httpServer)
      .post('/products')
      .send({
        name: 'Tênis',
        price: 199.9,
        sku: 'TEN',
      })
      .expect(201);

    await request(httpServer)
      .post('/products')
      .send({
        name: 'Tênis Reserva',
        price: 150,
        sku: 'TEN',
      })
      .expect(409);

    const invalidResponse = await request(httpServer)
      .post('/products')
      .send({
        name: 'Produto inválido',
        price: 10,
        sku: '12',
      })
      .expect(400);
    const invalidBody = invalidResponse.body as ValidationErrorBody;

    expect(invalidBody.message).toContain(
      'O SKU deve conter exatamente 3 caracteres.',
    );
  });
});
