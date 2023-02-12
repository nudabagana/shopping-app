import { DiscountCondition } from 'src/entities/discount.entity';
import { Product } from 'src/entities/product.entity';
import { ProductSet } from 'src/entities/productSet.entity';

export type MappedProduct = {
  count: number;
  product: Product;
};

type CalcDiscountProps = {
  currTotal: number;
  resultCondition: DiscountCondition;
  resultAmount: number;
};

const calcDiscount = ({
  resultAmount,
  resultCondition,
  currTotal,
}: CalcDiscountProps) => {
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
    resultAmount: setCount === 0 ? 0 : resultAmount,
    resultCondition,
  });
};

type GetSameProductsDiscountProps = {
  mappedProducts: MappedProduct[];
  itemCount: number;
  resultAmount: number;
  resultCondition: DiscountCondition;
};

const getSameProductsDiscount = ({
  mappedProducts,
  itemCount,
  resultAmount,
  resultCondition,
}: GetSameProductsDiscountProps) => {
  return mappedProducts.reduce((discount, { count, product }) => {
    const reminder = count % itemCount;
    const qtyWithDiscount = count - reminder;
    const productsTotal = qtyWithDiscount * product.price;
    const discountTotal = calcDiscount({
      currTotal: productsTotal,
      resultAmount,
      resultCondition,
    });

    return discount + discountTotal;
  }, 0);
};

export default { getProductsDiscount, getSameProductsDiscount, calcDiscount };
