import { CartItem } from "../entities/CartItem";
import { Cart } from "../entities/Cart";
import { Request, Response } from 'express';
import { AppDataSource } from '../data-source';

export const getCart = async (req: Request, res: Response) => {
    const userId = req.params.userId;

    try {
        const cartRepo = AppDataSource.getRepository(Cart);
        const cart = await cartRepo.findOne({
            where: { userId },
        });

        if (!cart) {
            return res.status(404).json({ message: 'Cart not found' });
        }

        return res.status(200).json(cart);
    } catch (error) {
        console.error('Error fetching cart:', error);
        return res.status(500).json({
            message: 'Internal server error',
            error: error instanceof Error ? error.message : String(error),
        });
    }
};

