import { Body, Controller, HttpStatus, Post, Res } from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import { Product } from 'src/entities/product.entity';
import cartService from 'src/services/cart.service';
import { Cart } from 'src/types/cart';

@ApiTags('Carts')
@Controller('Carts')
class CartsController {
  @ApiResponse({
    type: Product,
    status: HttpStatus.OK,
    description: 'Successful operation',
  })
  @Post('/total')
  async create(@Res() response: Response, @Body() cart: Cart) {
    return response
      .status(HttpStatus.OK)
      .send(cartService.calcTotal(cart.products));
  }
}

export default CartsController;
