import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductsModule } from './products/products.module';
import {
  getDatabasePath,
  shouldSynchronizeDatabase,
} from './config/environment';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useFactory: () => ({
        type: 'sqlite',
        database: getDatabasePath(),
        autoLoadEntities: true,
        synchronize: shouldSynchronizeDatabase(),
      }),
    }),
    ProductsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
