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
import { Discount, DiscountBase } from 'src/entities/discount.entity';
import discountsService from 'src/services/discounts.service';

@ApiInternalServerErrorResponse({ type: InternalServerErrorException })
@ApiTags('Discounts')
@Controller('Discounts')
class DiscountsController {
  @ApiResponse({
    type: Discount,
    status: HttpStatus.OK,
    description: 'Successful operation',
  })
  @Post('/')
  async create(@Body() body: DiscountBase) {
    return discountsService.add(body);
  }

  @ApiResponse({
    type: [Discount],
    status: HttpStatus.OK,
    description: 'Successful operation',
  })
  @Get('/')
  async getAll() {
    return discountsService.getAllOrdered();
  }

  @ApiResponse({
    type: Discount,
    status: HttpStatus.OK,
    description: 'Successful operation',
  })
  @ApiNotFoundResponse({ type: NotFoundException })
  @Get('/:uuid')
  async getOne(@Param('uuid') uuid: string) {
    return discountsService.getByUuid(uuid);
  }

  @ApiResponse({
    type: Boolean,
    status: HttpStatus.OK,
    description: 'Successful operation',
  })
  @ApiNotFoundResponse({ type: NotFoundException })
  @Delete('/:uuid')
  async remove(@Param('uuid') uuid: string) {
    return discountsService.removeByUuid(uuid);
  }
}

export default DiscountsController;
