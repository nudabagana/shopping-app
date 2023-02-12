jest.mock('./discounts.service');
jest.mock('./products.service');
import { CartProduct } from 'src/types/cart';
import cartService from './cart.service';
import discountsService from './discounts.service';
import productsService from './products.service';

describe('CartService', () => {
  const DISCOUNT_RULES = [
    {
      uuid: 'fb48851a-e2ca-412f-906e-8b16ac012222',
      priority: 1000,
      isActive: true,
      type: 'same_items',
      resultCondition: 'less_prc',
      amount: null,
      itemCount: 5,
      resultAmount: '0.2',
      productSet: null,
    },
    {
      uuid: 'fb48851a-e2ca-412f-906e-8b16ac013333',
      priority: 999,
      isActive: true,
      type: 'total_more',
      resultCondition: 'less',
      amount: '19.99',
      itemCount: null,
      resultAmount: '1',
      productSet: null,
    },
  ];

  const MELON_UUID = 'fb48851a-e2ca-412f-906e-8b16ac012220';
  const PRODUCTS = [
    {
      uuid: MELON_UUID,
      name: 'Watermelon',
      description: 'A refreshing melon-type fruit!',
      imgUrl: 'https://i.imgur.com/bmg9jJ1.png',
      price: '10',
    },
  ];
  (discountsService.getAllOrdered as jest.Mock).mockReturnValue(
    Promise.resolve(DISCOUNT_RULES),
  );
  (productsService.getAllByUuids as jest.Mock).mockReturnValue(
    Promise.resolve(PRODUCTS),
  );

  it('0 Melons (10$ ea) expect 0$', () => {
    const cart: CartProduct[] = [];
    expect(cartService.calcTotal(cart)).resolves.toBe(0);
  });

  it('1 Melons (10$ ea) expect 10$', () => {
    const cart: CartProduct[] = [{ productUuid: MELON_UUID, count: 1 }];
    expect(cartService.calcTotal(cart)).resolves.toBe(10);
  });

  it('2 Melons (10$ ea) expect 19$', () => {
    const cart: CartProduct[] = [{ productUuid: MELON_UUID, count: 2 }];
    expect(cartService.calcTotal(cart)).resolves.toBe(19);
  });

  it('7 Melons (10$ ea) expect 59$', () => {
    const cart: CartProduct[] = [{ productUuid: MELON_UUID, count: 7 }];
    expect(cartService.calcTotal(cart)).resolves.toBe(59);
  });

  it('12 Melons (10$ ea) expect 99$', () => {
    const cart: CartProduct[] = [{ productUuid: MELON_UUID, count: 12 }];
    expect(cartService.calcTotal(cart)).resolves.toBe(99);
  });

  it('13 Melons (10$ ea) expect Error (over 100$)', () => {
    const cart: CartProduct[] = [{ productUuid: MELON_UUID, count: 13 }];
    expect(cartService.calcTotal(cart)).rejects.toThrowError();
  });
});
