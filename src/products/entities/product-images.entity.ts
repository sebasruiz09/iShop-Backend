import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Product } from './product.entity';

@Entity()
export class ProductImage {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('text', {
    nullable: false,
  })
  url: string;

  //relation with other table
  @ManyToOne(
    //first callback return class with entitie
    () => Product,
    (Product) => Product.images,
  )
  Product: Product;
}
