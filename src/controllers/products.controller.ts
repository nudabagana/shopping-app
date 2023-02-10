import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import appService from 'src/app.service';

@ApiTags('Products')
@Controller('Products')
export class ProductsController {
  @Get('/')
  get(): string {
    return appService.getHello();
  }
}
