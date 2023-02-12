import {
  Discount,
  DiscountCondition,
  DiscountType,
} from './entities/discount.entity';
import { Product } from './entities/product.entity';
import { ProductSet } from './entities/productSet.entity';
import { ProductSetEntry } from './entities/productSetEntry.entity';
import discountsService from './services/discounts.service';
import productsService from './services/products.service';
import productSetEntriesService from './services/productSetEntries.service';
import productSetsService from './services/productSets.service';

const DEFAULT_PRODUCTS: Product[] = [
  {
    uuid: 'fb48851a-e2ca-412f-906e-8b16ac012220',
    name: 'Watermelon',
    price: 2,
    description: 'A refreshing melon-type fruit!',
    imgUrl: 'https://i.imgur.com/bmg9jJ1.png',
  },
  {
    uuid: 'fb48851a-e2ca-412f-906e-8b16ac012221',
    name: 'Firemelon',
    price: 10,
    description: 'A hot and spicy melon-type fruit!',
    imgUrl: 'https://i.imgur.com/FM6eHc3.png',
  },
  {
    uuid: 'fb48851a-e2ca-412f-906e-8b16ac012222',
    name: 'Earthmelon',
    price: 0.5,
    description: 'Pretty much a rock.',
    imgUrl: 'https://i.imgur.com/d6o7xxh.png',
  },
  {
    uuid: 'fb48851a-e2ca-412f-906e-8b16ac012223',
    name: 'Airmelon',
    price: 21,
    description: 'Someone made you pay for air, great!',
    imgUrl: 'https://i.imgur.com/b16qqU1.png',
  },
];
const DEFAULT_PRODUCT_SETS: ProductSet[] = [];
const DEFAULT_PRODUCT_SET_ENTRIES: ProductSetEntry[] = [];
const DEFAULT_DISCOUNTS: Discount[] = [
  {
    priority: 1000,
    isActive: true,
    type: DiscountType.SAME_ITEMS,
    uuid: 'fb48851a-e2ca-412f-906e-8b16ac012222',
    resultCondition: DiscountCondition.LESS_PRC,
    resultAmount: 0.2,
    itemCount: 5,
  },
  {
    priority: 999,
    isActive: true,
    type: DiscountType.TOTAL_MORE,
    amount: 19.99,
    uuid: 'fb48851a-e2ca-412f-906e-8b16ac013333',
    resultCondition: DiscountCondition.LESS,
    resultAmount: 1,
  },
];

type CreateProps<T> = {
  service: {
    getAllByUuids: (uuids: string[]) => Promise<T[]>;
    addWithId: (item: T[]) => Promise<T[]>;
  };
  items: T[];
};

const createItems = async <T extends { uuid: string }>({
  service,
  items,
}: CreateProps<T>) => {
  const existing = await service.getAllByUuids(items.map(({ uuid }) => uuid));
  const existingUuids = existing.map(({ uuid }) => uuid);
  const toCreate = items.filter(({ uuid }) => !existingUuids.includes(uuid));

  await service.addWithId(toCreate);
};

const create = async () => {
  await createItems({ service: productsService, items: DEFAULT_PRODUCTS });
  await createItems({
    service: productSetsService,
    items: DEFAULT_PRODUCT_SETS,
  });
  await createItems({
    service: productSetEntriesService,
    items: DEFAULT_PRODUCT_SET_ENTRIES,
  });
  await createItems({
    service: discountsService,
    items: DEFAULT_DISCOUNTS,
  });
};

export default { create };
