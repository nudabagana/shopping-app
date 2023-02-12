import { NotFoundException } from '@nestjs/common';
import { getConnection } from 'src/dbConnection';
import { Discount, DiscountBase } from 'src/entities/discount.entity';
import { In } from 'typeorm';

const getRepo = async () => (await getConnection()).getRepository(Discount);

const add = async (item: DiscountBase) => {
  const repo = await getRepo();
  const savedItem = await repo.save(item);

  return savedItem;
};

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
  const item = await repo.findOne({
    where: { uuid },
    relations: [
      'productSet',
      'productSet.productSetItems',
      'productSet.productSetItems.product',
    ],
  });
  if (!item) {
    throw new NotFoundException();
  }
  return item;
};

const removeByUuid = async (uuid: string) => {
  const repo = await getRepo();
  const item = await repo.findOne({ where: { uuid } });
  if (item) {
    await repo.remove(item);
  } else {
    throw new NotFoundException();
  }

  return true;
};

export default {
  getAllOrdered,
  getByUuid,
  getAllByUuids,
  removeByUuid,
  addWithId,
  add,
};
