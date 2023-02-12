import { getConnection } from 'src/dbConnection';
import { Discount } from 'src/entities/discount.entity';
import { In } from 'typeorm';

const getRepo = async () => (await getConnection()).getRepository(Discount);

const addWithId = async (item: Discount[]) => {
  const repo = await getRepo();
  const savedItems = await repo.save(item);

  return savedItems;
};

const getAllOrdered = async () => {
  const repo = await getRepo();
  return repo.find({
    relations: [
      'productSet',
      'productSet.productSetItems',
      'productSet.productSetItems.product',
    ],
    order: { priority: 'DESC' },
    where: { isActive: true },
  });
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
  getAllOrdered,
  getByUuid,
  getAllByUuids,
  removeByUuid,
  addWithId,
};
