import { CartItem } from "../entities/CartItem";
import { Cart } from "../entities/Cart";
import { Request, Response } from 'express';
import { AppDataSource } from '../data-source';
import axios from "axios";
import * as dotenv from 'dotenv';

const PRODUCT_SERVICE_URI = process.env.PRODUCT_SERVICE_URI

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

export const addItemToCart = async (req: Request, res: Response) => {
    const userId = req.params.userId;
    const { productId, quantity } = req.body

    if (!productId || quantity <= 0) {
        return res.status(400).json({ message: 'Invalid productId or quantity' });
    }

    try {
        const productRes = await axios.get(`${PRODUCT_SERVICE_URI}/api/products/${productId}`);
        if (productRes.status !== 200 || !productRes.data) {
            return res.status(404).json({ message: `Product with ID ${productId} not found` });
        }

        const cartRepo = AppDataSource.getRepository(Cart);
        const cartItemRepo = AppDataSource.getRepository(CartItem);

        let cart = await cartRepo.findOne({
            where: { userId },
            relations: ['items'],
        });

        if (!cart) {
            cart = new Cart();
            cart.userId = userId;
            cart.items = [];
        }

        let existingItem = cart.items.find((item) => item.productId === productId);

        if (existingItem) {
            existingItem.quantity += quantity;
        } else {
            const cartItem = new CartItem();
            cartItem.productId = productId;
            cartItem.quantity = quantity;
            cartItem.cart = cart;
            cart.items.push(cartItem);
        }

        const savedCart = await cartRepo.save(cart);

        res.status(201).json({
            id: savedCart.id,
            userId: savedCart.userId,
            items: savedCart.items.map(item => ({
                id: item.id,
                productId: item.productId,
                quantity: item.quantity,
            })),
        });
    } catch (error) {
        console.error('Add to cart error:', error);
        return res.status(500).json({
            message: 'Internal server error',
            error: error instanceof Error ? error.message : String(error),
        });
    }
};

export const removeItemFromCart = async (req: Request, res: Response) => {
    const { userId, productId } = req.params;

    try {
        const cartRepo = AppDataSource.getRepository(Cart);
        const cartItemRepo = AppDataSource.getRepository(CartItem);

        const cart = await cartRepo.findOne({
            where: { userId },
            relations: ['items'],
        });

        if (!cart) {
            return res.status(404).json({ message: 'Cart not found' });
        }

        const itemToRemove = cart.items.find(item => item.productId === productId);

        if (!itemToRemove) {
            return res.status(404).json({ message: 'Product not found in cart' });
        }
        await cartItemRepo.remove(itemToRemove);

        cart.items = cart.items.filter(item => item.productId !== productId);
        await cartRepo.save(cart);

        return res.json({ message: 'Product removed from cart successfully' });
    } catch (error) {
        console.error('Remove from cart error:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};

export const updateItemInCart = async (req: Request, res: Response) => {
    const { userId, productId } = req.params;
    const { quantity } = req.body;

    if (quantity <= 0) {
        return res.status(400).json({ message: 'Quantity must be greater than 0' });
    }

    try {
        const cartRepo = AppDataSource.getRepository(Cart);
        const cartItemRepo = AppDataSource.getRepository(CartItem);

        const cart = await cartRepo.findOne({
            where: { userId },
            relations: ['items'],
        });

        if (!cart) {
            return res.status(404).json({ message: 'Cart not found' });
        }

        const itemToUpdate = cart.items.find(item => item.productId === productId);

        if (!itemToUpdate) {
            return res.status(404).json({ message: 'Product not found in cart' });
        }

        itemToUpdate.quantity = quantity;
        await cartItemRepo.save(itemToUpdate);

        return res.json({
            message: 'Cart item updated successfully', item: {
                id: itemToUpdate.id,
                productId: itemToUpdate.productId,
                quantity: itemToUpdate.quantity
            }
        });
    } catch (error) {
        console.error('Update cart item error:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};
