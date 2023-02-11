import { getConnection } from 'src/dbConnection';
import { Product, ProductBase } from 'src/entities/product.entity';

const getRepo = async () => (await getConnection()).getRepository(Product);

const add = async (item: ProductBase): Promise<Product> => {
  const repo = await getRepo();
  const savedItem = await repo.save(item);

  return savedItem;
};

const getAll = async () => {
  const repo = await getRepo();
  return repo.find();
};

const getByUuid = async (uuid: string) => {
  const repo = await getRepo();
  return repo.findOne({ where: { uuid } });
};

const removeByUuid = async (uuid: string) => {
  const repo = await getRepo();
  const item = await repo.findOne({ where: { uuid } });
  if (item) {
    await repo.remove(item);
  } else {
    throw new Error('No entity found');
  }

  return true;
};

export default { getAll, getByUuid, removeByUuid, add };
