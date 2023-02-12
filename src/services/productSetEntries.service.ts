import { NotFoundException } from '@nestjs/common';
import { getConnection } from 'src/dbConnection';
import { ProductSetEntry } from 'src/entities/productSetEntry.entity';
import { In } from 'typeorm';

const getRepo = async () =>
  (await getConnection()).getRepository(ProductSetEntry);

const addWithId = async (item: ProductSetEntry[]) => {
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
  const item = await repo.findOne({ where: { uuid } });
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
  getAll,
  getByUuid,
  getAllByUuids,
  removeByUuid,
  addWithId,
};
