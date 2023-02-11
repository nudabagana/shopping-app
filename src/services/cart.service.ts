import { CartItem } from 'src/types/cart';
import limitService from './limit.service';

const calcTotal = async (items: CartItem[]) => {
  const total = items.reduce((total, { count }) => total + count, 0);
  limitService.validateTotal(total);
  return total;
};

export default { calcTotal };
