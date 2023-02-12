import { ApiProperty } from '@nestjs/swagger';
import { nullable } from 'src/consts';
import { Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { ProductSetEntry, ProductSetEntryBase } from './productSetEntry.entity';

export class ProductSetBase {
  @ApiProperty({ type: [ProductSetEntryBase], nullable })
  productSetItems?: ProductSetEntryBase[];
}

@Entity()
export class ProductSet extends ProductSetBase {
  @ApiProperty()
  @PrimaryGeneratedColumn('uuid')
  uuid: string;

  @ApiProperty({ type: [ProductSetEntry], nullable })
  @OneToMany(() => ProductSetEntry, (entry) => entry.productSet, {
    cascade: true,
  })
  productSetItems?: ProductSetEntry[];
}
