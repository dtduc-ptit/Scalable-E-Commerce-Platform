import { Router, Request, Response } from 'express';
import { getCart, addItemToCart, removeItemFromCart, updateItemInCart } from '../controllers/cart.controllers';

const router = Router();

router.get('/:userId', (req: Request, res: Response) => {
    getCart(req, res);
});

router.post('/:userId/add', (req: Request, res: Response) => {
    addItemToCart(req, res);
})

router.delete('/:userId/remove/:productId', (req: Request, res: Response) => {
    removeItemFromCart(req, res);
})

router.put('/:userId/update/:productId', (req: Request, res: Response) => {
    updateItemInCart(req, res);
});

export default router;