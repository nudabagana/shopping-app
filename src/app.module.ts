import { Module } from '@nestjs/common';
import CartsController from './controllers/carts.controller';
import DiscountsController from './controllers/discounts.controller';
import ProductsController from './controllers/products.controller';

@Module({
  imports: [],
  controllers: [ProductsController, CartsController, DiscountsController],
  providers: [],
})
export class AppModule {}
