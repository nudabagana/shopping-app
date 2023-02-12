import { ApiProperty } from '@nestjs/swagger';
import { Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { ProductSetEntry } from './productSetEntry.entity';

@Entity()
export class ProductSet {
  @ApiProperty()
  @PrimaryGeneratedColumn('uuid')
  uuid: string;

  @OneToMany(() => ProductSetEntry, (entry) => entry.productSet)
  productSetItems?: ProductSetEntry[];
}
