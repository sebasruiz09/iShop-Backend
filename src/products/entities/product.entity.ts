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
}
