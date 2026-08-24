import { INestApplication, ValidationPipe } from '@nestjs/common';
import { getAllowedOrigins } from './config/environment';

export function configureApp(app: INestApplication): void {
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  app.enableCors({
    origin: getAllowedOrigins(),
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
  });
}
