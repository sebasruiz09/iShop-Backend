import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
//entity decorator

@Entity()
export class Product {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('text', {
    unique: true,
  })
  title: string;

  @Column('float', {
    default: 0,
  })
  price: number;

  @Column({
    // data type specification
    type: 'text',
    // null data allowed
    nullable: true,
  })
  description: string;

  @Column('text', {
    unique: true,
  })
  slug: string;

  @Column('float', {
    default: 0,
  })
  stock: number;

  @Column('text', {
    //declare array into db
    array: true,
  })
  sizes: string[];

  @Column('text')
  gender: string;
}
