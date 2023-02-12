import {
  BadRequestException,
  Body,
  Controller,
  HttpStatus,
  InternalServerErrorException,
  Post,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiInternalServerErrorResponse,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import cartService from 'src/services/cart.service';
import { Cart } from 'src/types/cart';

@ApiInternalServerErrorResponse({ type: InternalServerErrorException })
@ApiTags('Carts')
@Controller('Carts')
class CartsController {
  @ApiResponse({
    type: Number,
    status: HttpStatus.CREATED,
    description: 'Successful operation',
  })
  @ApiBadRequestResponse({ type: BadRequestException })
  @Post('/total')
  async total(@Body() cart: Cart) {
    return cartService.calcTotal(cart.products);
  }
}

export default CartsController;
