import { Router, Request, Response } from 'express';
import { getCart, addItemToCart } from '../controllers/cart.controllers';

const router = Router();

router.get('/:userId', (req: Request, res: Response) => {
    getCart(req, res);
});

router.post('/:userId/add', (req: Request, res: Response) => {
    addItemToCart(req, res);
})

export default router;