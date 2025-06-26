import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import { CartItem } from "./CartItem";

@Entity()
export class Cart {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  userId!: string;

  @OneToMany(() => CartItem, (item) => item.cart, {
    cascade: true,
    eager: true, 
  })
  items!: CartItem[];
}
