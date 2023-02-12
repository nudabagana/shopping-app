import { BadRequestException } from '@nestjs/common';
import { ERR_CODE } from 'src/errorCodes';

const MAX_TOTAL = 100;
const MIN_TOTAL = 0;

const validateTotal = (total: number) => {
  if (total > MAX_TOTAL) {
    throw new BadRequestException({ code: ERR_CODE.TOTAL_EXCEEDS_LIMIT });
  }
  if (total < MIN_TOTAL) {
    throw new BadRequestException({ code: ERR_CODE.TOTAL_TOO_SMALL });
  }
};

export default { validateTotal };
