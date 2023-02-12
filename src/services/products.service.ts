import { NotFoundException } from '@nestjs/common';
import { getConnection } from 'src/dbConnection';
import { Product, ProductBase } from 'src/entities/product.entity';
import { In } from 'typeorm';

const getRepo = async () => (await getConnection()).getRepository(Product);

const add = async (item: ProductBase): Promise<Product> => {
  const repo = await getRepo();
  const savedItem = await repo.save(item);

  return savedItem;
};

const addWithId = async (item: Product[]) => {
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
  add,
  addWithId,
};
