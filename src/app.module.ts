import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductsController } from './controllers/products.controller';
import * as dotenv from 'dotenv';
dotenv.config();

if (!process.env.DB_USER || !process.env.DB_PASSWORD) {
  throw new Error(
    'Env variables DB_USER or DB_PASSWORD not set. Please upadate your .env file. ',
  );
}

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: 'shoppingdb',
      entities: [],
    }),
  ],
  controllers: [ProductsController],
  providers: [],
})
export class AppModule {}
