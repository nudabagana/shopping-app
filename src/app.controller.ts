import { Controller, Get } from '@nestjs/common';
import appService from './app.service';

@Controller()
export class AppController {
  @Get('/blue')
  getHello(): string {
    return appService.getHello();
  }
}
