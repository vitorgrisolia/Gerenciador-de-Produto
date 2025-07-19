import { Entity, Column, PrimaryGeneratedColumn, Unique } from 'typeorm';

@Entity()
@Unique(['sku']) // SKU único no banco de dados
export class Product {
  @PrimaryGeneratedColumn('uuid') // ID único
    id: string;

    @Column()
    name: string;

    @Column({ type: 'float' })
    price: number;

    @Column()
    sku: string;
}