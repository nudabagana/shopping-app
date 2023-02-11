import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  Post,
} from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { Product, ProductBase } from 'src/entities/product.entity';
import productsService from 'src/services/products.service';

@ApiTags('Products')
@Controller('Products')
class ProductsController {
  @ApiResponse({
    type: Product,
    status: HttpStatus.OK,
    description: 'Successful operation',
  })
  @Post('/')
  async create(@Body() body: ProductBase) {
    return productsService.add(body);
  }

  @ApiResponse({
    type: [Product],
    status: HttpStatus.OK,
    description: 'Successful operation',
  })
  @Get('/')
  async getOne() {
    return productsService.getAll();
  }

  @ApiResponse({
    type: [Product],
    status: HttpStatus.OK,
    description: 'Successful operation',
  })
  @Get('/:uuid')
  async getAll(@Param('uuid') uuid: string) {
    return productsService.getByUuid(uuid);
  }

  @ApiResponse({
    type: Boolean,
    status: HttpStatus.OK,
    description: 'Successful operation',
  })
  @Delete('/:uuid')
  async remove(@Param('uuid') uuid: string) {
    return productsService.removeByUuid(uuid);
  }
}

export default ProductsController;
