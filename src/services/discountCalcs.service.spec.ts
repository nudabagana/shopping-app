import { DiscountCondition } from 'src/entities/discount.entity';
import discountCalcsService from './discountCalcs.service';

describe('DiscountCalcs', () => {
  describe('calcDiscount', () => {
    it('10 less should be 10"', () => {
      expect(
        discountCalcsService.calcDiscount({
          currTotal: 100,
          resultAmount: 10,
          resultCondition: DiscountCondition.LESS,
        }),
      ).toBe(10);
    });

    it('0.1 less_prc from 100 should be 10"', () => {
      expect(
        discountCalcsService.calcDiscount({
          currTotal: 100,
          resultAmount: 0.1,
          resultCondition: DiscountCondition.LESS_PRC,
        }),
      ).toBe(10);
    });

    it('10 more should be -10"', () => {
      expect(
        discountCalcsService.calcDiscount({
          currTotal: 100,
          resultAmount: 10,
          resultCondition: DiscountCondition.MORE,
        }),
      ).toBe(-10);
    });

    it('0.1 more_prc from 100 should be -10"', () => {
      expect(
        discountCalcsService.calcDiscount({
          currTotal: 100,
          resultAmount: 0.1,
          resultCondition: DiscountCondition.MORE_PRC,
        }),
      ).toBe(-10);
    });
  });

  describe('getProductsDiscount', () => {
    const PRODUCT_SET_UUID = 'product-set';
    const PRODUCT1 = {
      uuid: 'PRODUCT1',
      description: '',
      name: '',
      price: 10,
    };
    const PRODUCT2 = {
      uuid: 'PRODUCT2',
      description: '',
      name: '',
      price: 1,
    };

    const props = {
      resultCondition: DiscountCondition.LESS,
      resultAmount: 10,
      productSet: {
        uuid: PRODUCT_SET_UUID,
        productSetItems: [
          {
            uuid: '1',
            quantity: 2,
            product: PRODUCT1,
            productSet: { uuid: PRODUCT_SET_UUID },
          },
          {
            uuid: '2',
            quantity: 6,
            product: PRODUCT2,
            productSet: { uuid: PRODUCT_SET_UUID },
          },
        ],
      },
      mappedProducts: [],
    };

    it('10 discount when less product group matches', () => {
      const PRODUCTS_IN_CART = [
        { count: 10, product: PRODUCT1 },
        { count: 6, product: PRODUCT2 },
      ];
      props.mappedProducts = PRODUCTS_IN_CART;

      expect(discountCalcsService.getProductsDiscount(props)).toBe(10);
    });

    it('2.6 discount when less_prc product group matches', () => {
      const PRODUCTS_IN_CART = [
        { count: 10, product: PRODUCT1 },
        { count: 6, product: PRODUCT2 },
      ];
      props.mappedProducts = PRODUCTS_IN_CART;
      props.resultCondition = DiscountCondition.LESS_PRC;
      props.resultAmount = 0.1;

      expect(discountCalcsService.getProductsDiscount(props)).toBe(2.6);
    });

    it('0 discount when group does not match', () => {
      const PRODUCTS_IN_CART = [
        { count: 10, product: PRODUCT1 },
        { count: 5, product: PRODUCT2 },
      ];
      props.mappedProducts = PRODUCTS_IN_CART;

      expect(discountCalcsService.getProductsDiscount(props)).toBe(0);
    });
  });

  describe('getSameProductsDiscount', () => {
    const PRODUCT1 = {
      uuid: 'PRODUCT1',
      description: '',
      name: '',
      price: 10,
    };
    const PRODUCT2 = {
      uuid: 'PRODUCT2',
      description: '',
      name: '',
      price: 1,
    };

    const props = {
      resultCondition: DiscountCondition.LESS,
      resultAmount: 10,
      itemCount: 5,
      mappedProducts: [],
    };

    it('2 groups matches with flat 10 discount. Expected 20.', () => {
      const PRODUCTS_IN_CART = [
        { count: 10, product: PRODUCT1 },
        { count: 6, product: PRODUCT2 },
      ];
      props.mappedProducts = PRODUCTS_IN_CART;

      expect(discountCalcsService.getSameProductsDiscount(props)).toBe(20);
    });

    it('2 groups matches with flat 0.2 discount. Expected 21.', () => {
      const PRODUCTS_IN_CART = [
        { count: 10, product: PRODUCT1 },
        { count: 5, product: PRODUCT2 },
      ];
      props.mappedProducts = PRODUCTS_IN_CART;
      props.resultCondition = DiscountCondition.LESS_PRC;
      props.resultAmount = 0.2;

      expect(discountCalcsService.getSameProductsDiscount(props)).toBe(21);
    });

    it('no groupd match. Expected 0.', () => {
      const PRODUCTS_IN_CART = [
        { count: 3, product: PRODUCT1 },
        { count: 4, product: PRODUCT2 },
      ];
      props.mappedProducts = PRODUCTS_IN_CART;

      expect(discountCalcsService.getSameProductsDiscount(props)).toBe(0);
    });
  });
});
