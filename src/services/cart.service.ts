import {
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import { Discount, DiscountType } from 'src/entities/discount.entity';
import { Product } from 'src/entities/product.entity';
import { ERR_CODE } from 'src/errorCodes';
import { CartProduct } from 'src/types/cart';
import discountCalcsService, { MappedProduct } from './discountCalcs.service';
import discountsService from './discounts.service';
import limitService from './limit.service';
import productsService from './products.service';

type MapProductsProps = {
  cartProducts: CartProduct[];
  products: Product[];
};

const mapProducts = ({ cartProducts, products }: MapProductsProps) =>
  cartProducts.map(({ count, productUuid }) => {
    const product = products.find(({ uuid }) => uuid === productUuid);
    if (!product) {
      throw new BadRequestException({ code: ERR_CODE.NON_EXISINT_PRODUCT });
    }
    return { count, product };
  });

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
    ({
      type,
      resultCondition,
      amount,
      productSet,
      resultAmount,
      itemCount,
    }) => {
      switch (type) {
        case DiscountType.SAME_ITEMS:
          if (itemCount === undefined || itemCount === null) {
            throw new InternalServerErrorException({
              code: ERR_CODE.MALFORMED_DISCOUNT,
            });
          }
          currTotal -= discountCalcsService.getSameProductsDiscount({
            mappedProducts: mappedProducts,
            itemCount,
            resultCondition,
            resultAmount,
          });
          break;
        case DiscountType.ITEMS:
          if (!productSet) {
            throw new InternalServerErrorException({
              code: ERR_CODE.MALFORMED_DISCOUNT,
            });
          }
          currTotal -= discountCalcsService.getProductsDiscount({
            mappedProducts: mappedProducts,
            productSet,
            resultCondition,
            resultAmount,
          });
          break;
        case DiscountType.TOTAL_LESS:
          if (!amount) {
            throw new InternalServerErrorException({
              code: ERR_CODE.MALFORMED_DISCOUNT,
            });
          }
          if (currTotal < amount) {
            currTotal -= discountCalcsService.calcDiscount({
              currTotal,
              resultAmount,
              resultCondition,
            });
          }
          break;
        case DiscountType.TOTAL_MORE:
          if (!amount) {
            throw new InternalServerErrorException({
              code: ERR_CODE.MALFORMED_DISCOUNT,
            });
          }
          if (currTotal > amount) {
            currTotal -= discountCalcsService.calcDiscount({
              currTotal,
              resultAmount,
              resultCondition,
            });
          }
          break;
        default:
          throw new InternalServerErrorException({
            code: ERR_CODE.MALFORMED_DISCOUNT,
          });
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
