import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { Cart } from './entities/Cart';
import { CartItem } from './entities/CartItem';
import * as dotenv from 'dotenv';

dotenv.config();

export const AppDataSource = new DataSource({
  type: 'mysql',
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  synchronize: true,
  logging: false,
  entities: [Cart, CartItem],
});
