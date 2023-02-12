import { getConnection } from 'src/dbConnection';
import { ProductSet } from 'src/entities/productSet.entity';
import { In } from 'typeorm';

const getRepo = async () => (await getConnection()).getRepository(ProductSet);

const addWithId = async (item: ProductSet[]) => {
  const repo = await getRepo();
  const savedItems = await repo.save(item);

  return savedItems;
};

const getAll = async () => {
  const repo = await getRepo();
  return repo.find();
};

const getAllByUuids = async (uuids: string[]) => {
  const repo = await getRepo();
  return repo.find({ where: { uuid: In(uuids) } });
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

export default {
  getAll,
  getByUuid,
  getAllByUuids,
  removeByUuid,
  addWithId,
};
