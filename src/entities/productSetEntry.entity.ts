import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Product, ProductBase } from './product.entity';
import { ProductSet } from './productSet.entity';

export class ProductSetEntryBase {
  @ApiProperty()
  quantity: number;

  @ApiProperty({ type: ProductBase })
  product: ProductBase;
}

@Entity()
export class ProductSetEntry extends ProductSetEntryBase {
  @ApiProperty()
  @PrimaryGeneratedColumn('uuid')
  uuid: string;

  @ApiProperty()
  @Column()
  quantity: number;

  @ApiProperty({ type: Product })
  @ManyToOne(() => Product, { cascade: true })
  product: Product;

  @ManyToOne(() => ProductSet)
  productSet: ProductSet;
}
