import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm";
import { Cart } from "./Cart";

@Entity()
export class CartItem {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  productId!: string;

  @Column({ default: 1 })
  quantity!: number;

  @ManyToOne(() => Cart, (cart) => cart.items, { onDelete: "CASCADE" })
  cart!: Cart;
}
