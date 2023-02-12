import { Body, Controller, HttpStatus, Post } from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import cartService from 'src/services/cart.service';
import { Cart } from 'src/types/cart';

@ApiTags('Carts')
@Controller('Carts')
class CartsController {
  @ApiResponse({
    type: Number,
    status: HttpStatus.CREATED,
    description: 'Successful operation',
  })
  @Post('/total')
  async total(@Body() cart: Cart) {
    return cartService.calcTotal(cart.products);
  }
}

export default CartsController;
