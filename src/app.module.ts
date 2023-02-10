import { Module } from '@nestjs/common';
import { ProductsController } from './controllers/products.controller';

@Module({
  imports: [],
  controllers: [ProductsController],
  providers: [],
})
export class AppModule {}
