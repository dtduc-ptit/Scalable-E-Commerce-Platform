import 'reflect-metadata';
import { AppDataSource } from './data-source';
import * as dotenv from 'dotenv';
import express, { Request, Response } from 'express';

dotenv.config(); 

const app = express();
const PORT = parseInt(process.env.PORT || '3003', 10);

AppDataSource.initialize()
  .then(() => {
    console.log('Shopping Cart DB connected');

    app.listen(PORT, () => {
      console.log(`Shopping Cart Service running on port ${PORT}`);
    });
  })
  .catch((error) => console.error('DB Init error:', error));
