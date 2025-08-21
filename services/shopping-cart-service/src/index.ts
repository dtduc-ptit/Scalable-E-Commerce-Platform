import 'reflect-metadata';
import { AppDataSource } from './data-source';
import * as dotenv from 'dotenv';
import express, { Request, Response } from 'express';
import cartRoutes from './routes/cart.routes';

dotenv.config(); 

const app = express();
app.use(express.json());

app.use('', cartRoutes);

const PORT = parseInt(process.env.PORT || '3003', 10);

AppDataSource.initialize()
  .then(() => {
    console.log('Shopping Cart DB connected');

    app.listen(PORT, () => {
      console.log(`Shopping Cart Service running on port ${PORT}`);
    });
  })
  .catch((error) => console.error('DB Init error:', error));
