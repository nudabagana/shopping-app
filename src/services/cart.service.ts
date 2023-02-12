import { InternalServerErrorException } from '@nestjs/common';
import {
  Discount,
  DiscountCondition,
  DiscountType,
} from 'src/entities/discount.entity';
import { Product } from 'src/entities/product.entity';
import { ProductSet } from 'src/entities/productSet.entity';
import { CartProduct } from 'src/types/cart';
import discountsService from './discounts.service';
import limitService from './limit.service';
import productsService from './products.service';

export const SAME_TYPE_PRODUCT = {
  description: 'SYS',
  name: 'SAME_TYPE',
  price: 0,
  uuid: 'fb48851a-e2ca-412f-906e-8b16ac018888',
};

type MapProductsProps = {
  cartProducts: CartProduct[];
  products: Product[];
};

const mapProducts = ({ cartProducts, products }: MapProductsProps) =>
  cartProducts.map(({ count, productUuid }) => {
    const product = products.find(({ uuid }) => uuid === productUuid);
    if (!product) {
      throw new InternalServerErrorException();
    }
    return { count, product };
  });

type MappedProduct = {
  count: number;
  product: Product;
};

type GetProductsDiscountProps = {
  mappedProducts: MappedProduct[];
  productSet: ProductSet;
  resultAmount: number;
  resultCondition: DiscountCondition;
};

const getProductsDiscount = ({
  mappedProducts,
  productSet,
  resultAmount,
  resultCondition,
}: GetProductsDiscountProps) => {
  const sameTypeProductRule = productSet.productSetItems?.find(
    ({ product }) => product.uuid === SAME_TYPE_PRODUCT.uuid,
  );
  if (sameTypeProductRule) {
    return mappedProducts.reduce((discount, { count, product }) => {
      const reminder = count % sameTypeProductRule.quantity;
      const qtyWithDiscount = count - reminder;
      const productsTotal = qtyWithDiscount * product.price;
      const discountTotal = calcDiscount({
        currTotal: productsTotal,
        resultAmount,
        resultCondition,
      });
      return discount + discountTotal;
    }, 0);
  }

  const affectedEntries: { item: MappedProduct; discountQty: number }[] = [];
  const setCount = productSet.productSetItems?.reduce(
    (setCount, { product, quantity }) => {
      const item = mappedProducts.find(
        (item) => item.product.uuid === product.uuid,
      );
      if (!item) {
        return 0;
      }

      const itemCount = item.count - (item.count % quantity);
      affectedEntries.push({ item, discountQty: quantity });

      return Math.min(setCount, itemCount / quantity);
    },
    Number.POSITIVE_INFINITY,
  );

  const totalForDiscount = affectedEntries.reduce(
    (total, { discountQty, item }) =>
      total + discountQty * setCount * item.product.price,
    0,
  );
  return calcDiscount({
    currTotal: totalForDiscount,
    resultAmount,
    resultCondition,
  });
};

type ApplyResultProps = {
  currTotal: number;
  resultCondition: DiscountCondition;
  resultAmount: number;
};

const calcDiscount = ({
  resultAmount,
  resultCondition,
  currTotal,
}: ApplyResultProps) => {
  switch (resultCondition) {
    case DiscountCondition.LESS:
      return resultAmount;
    case DiscountCondition.LESS_PRC:
      return currTotal * resultAmount;
    case DiscountCondition.MORE:
      return -1 * resultAmount;
    case DiscountCondition.MORE_PRC:
      return -1 * currTotal * resultAmount;
  }
};

type ApplyDiscountsProps = {
  total: number;
  discounts: Discount[];
  mappedProducts: MappedProduct[];
};

const applyDiscounts = ({
  discounts,
  mappedProducts,
  total,
}: ApplyDiscountsProps) => {
  let currTotal = total;
  discounts.forEach(
    ({ type, resultCondition, amount, productSet, resultAmount }) => {
      switch (type) {
        case DiscountType.ITEMS:
          if (!productSet) {
            throw new InternalServerErrorException();
          }
          currTotal -= getProductsDiscount({
            mappedProducts: mappedProducts,
            productSet,
            resultCondition,
            resultAmount,
          });
          break;
        case DiscountType.TOTAL_LESS:
          if (!amount) {
            throw new InternalServerErrorException();
          }
          if (currTotal < amount) {
            currTotal -= calcDiscount({
              currTotal,
              resultAmount,
              resultCondition,
            });
          }
          break;
        case DiscountType.TOTAL_MORE:
          if (!amount) {
            throw new InternalServerErrorException();
          }
          if (currTotal > amount) {
            currTotal -= calcDiscount({
              currTotal,
              resultAmount,
              resultCondition,
            });
          }
          break;
        default:
          throw new InternalServerErrorException();
      }
    },
  );

  return currTotal;
};

const calcTotal = async (cartProducts: CartProduct[]) => {
  const [discounts, products] = await Promise.all([
    discountsService.getAllOrdered(),
    productsService.getAllByUuids(
      cartProducts.map(({ productUuid }) => productUuid),
    ),
  ]);

  const mappedProducts = mapProducts({ cartProducts: cartProducts, products });
  const total = mappedProducts.reduce(
    (sum, { count, product }) => sum + count * product.price,
    0,
  );

  const totalDiscounted = applyDiscounts({
    mappedProducts,
    total,
    discounts,
  });

  limitService.validateTotal(totalDiscounted);
  return totalDiscounted;
};

export default { calcTotal };
