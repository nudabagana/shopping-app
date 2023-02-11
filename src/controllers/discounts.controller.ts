import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Discounts')
@Controller('Discounts')
class DiscountsController {}

export default DiscountsController;
