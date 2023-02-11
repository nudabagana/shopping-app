/* eslint-disable no-await-in-loop */
import { DataSource, DataSourceOptions } from 'typeorm';
import { MS_IN_S } from './consts';
import { wait } from './utils/wait';
import * as dotenv from 'dotenv';
import { Product } from './entities/product.entity';
import { ProductSet } from './entities/productSet.entity';
import { ProductSetEntry } from './entities/productSetItem.entity';
import { Discount } from './entities/discount.entity';
dotenv.config();

if (!process.env.DB_USER || !process.env.DB_PASSWORD) {
  throw new Error(
    'Env variables DB_USER or DB_PASSWORD not set. Please upadate your .env file. ',
  );
}

const config: DataSourceOptions = {
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: 'shoppingdb',
  synchronize: true,
  logging: true,
  entities: [Product, ProductSet, ProductSetEntry, Discount],
  subscribers: [],
  migrations: [],
};

const RETRY_DELAY = 5 * MS_IN_S;
const RETRY_AMOUNT = 10;

let connection: DataSource | null = null;

export const dbConnect = async () => {
  let tries = 0;
  if (!connection) {
    while (!connection) {
      try {
        connection = new DataSource(config);
        await connection.initialize();
        return connection;
      } catch (e) {
        tries += 1;
        if (tries >= RETRY_AMOUNT) {
          throw e;
        }
        console.error(
          `ERROR connecting to DB. Retrying in ${RETRY_DELAY}ms. (try ${tries}/${RETRY_AMOUNT})`,
        );
        await wait(RETRY_DELAY);
      }
    }
  }
  return connection;
};

export const getConnection = async () => {
  if (connection) {
    return connection;
  }
  return dbConnect();
};

export const dbDisconnect = async () => {
  if (connection) {
    await connection.destroy();
    connection = null;
  }
};
