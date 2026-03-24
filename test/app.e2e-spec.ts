import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { configureApp } from './../src/app.setup';

describe('Products API (e2e)', () => {
  let app: INestApplication;
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
  });

  afterAll(async () => {
    await app.close();

    process.env.DATABASE_PATH = originalEnv.DATABASE_PATH;
    process.env.DB_SYNCHRONIZE = originalEnv.DB_SYNCHRONIZE;
    process.env.NODE_ENV = originalEnv.NODE_ENV;
  });

  it('creates, lists, updates and deletes a product', async () => {
    const createResponse = await request(app.getHttpServer())
      .post('/products')
      .send({
        name: 'Camiseta Azul',
        price: 49.9,
        sku: 'cam',
      })
      .expect(201);

    expect(createResponse.body).toMatchObject({
      name: 'Camiseta Azul',
      price: 49.9,
      sku: 'CAM',
      missingLetter: 'b',
    });
    expect(createResponse.body.id).toEqual(expect.any(String));

    const productId = createResponse.body.id;

    const listResponse = await request(app.getHttpServer())
      .get('/products')
      .expect(200);

    expect(listResponse.body).toEqual([
      expect.objectContaining({
        id: productId,
        name: 'Camiseta Azul',
        sku: 'CAM',
        missingLetter: 'b',
      }),
    ]);

    await request(app.getHttpServer())
      .put(`/products/${productId}`)
      .send({
        name: 'Bermuda Preta',
        price: 79.9,
        sku: 'BER',
      })
      .expect(200)
      .expect(({ body }) => {
        expect(body).toMatchObject({
          id: productId,
          name: 'Bermuda Preta',
          sku: 'BER',
          missingLetter: 'a',
        });
      });

    await request(app.getHttpServer())
      .delete(`/products/${productId}`)
      .expect(200)
      .expect({
        message: 'Produto removido com sucesso.',
      });
  });

  it('rejects invalid payloads and duplicate SKUs', async () => {
    await request(app.getHttpServer())
      .post('/products')
      .send({
        name: 'Tênis',
        price: 199.9,
        sku: 'TEN',
      })
      .expect(201);

    await request(app.getHttpServer())
      .post('/products')
      .send({
        name: 'Tênis Reserva',
        price: 150,
        sku: 'TEN',
      })
      .expect(409);

    await request(app.getHttpServer())
      .post('/products')
      .send({
        name: 'Produto inválido',
        price: 10,
        sku: '12',
      })
      .expect(400)
      .expect(({ body }) => {
        expect(body.message).toContain('O SKU deve conter exatamente 3 caracteres.');
      });
  });
});
