import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  InternalServerErrorException,
  NotFoundException,
  Param,
  Post,
} from '@nestjs/common';
import {
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Product, ProductBase } from 'src/entities/product.entity';
import productsService from 'src/services/products.service';

@ApiInternalServerErrorResponse({ type: InternalServerErrorException })
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
  async getAll() {
    return productsService.getAll();
  }

  @ApiResponse({
    type: Product,
    status: HttpStatus.OK,
    description: 'Successful operation',
  })
  @ApiNotFoundResponse({ type: NotFoundException })
  @Get('/:uuid')
  async getOne(@Param('uuid') uuid: string) {
    return productsService.getByUuid(uuid);
  }

  @ApiResponse({
    type: Boolean,
    status: HttpStatus.OK,
    description: 'Successful operation',
  })
  @ApiNotFoundResponse({ type: NotFoundException })
  @Delete('/:uuid')
  async remove(@Param('uuid') uuid: string) {
    return productsService.removeByUuid(uuid);
  }
}

export default ProductsController;
