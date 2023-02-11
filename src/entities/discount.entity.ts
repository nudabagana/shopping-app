import { ApiProperty } from '@nestjs/swagger';
import { nullable } from 'src/consts';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { ProductSet } from './productSet.entity';

export enum DiscountType {
  TOTAL = 'total',
  ITEMS = 'items',
}

export enum DiscountCondition {
  MORE = 'more',
  MORE_PRC = 'more_prc',
  LESS = 'less',
  LESS_PRC = 'less_prc',
}

@Entity()
export class Discount {
  @ApiProperty()
  @PrimaryGeneratedColumn('uuid')
  uuid: string;

  @Column({ default: 0 })
  priority: number;

  @ApiProperty()
  @Column({ type: 'enum', enum: DiscountType })
  type: DiscountType;

  @ApiProperty()
  @Column({ type: 'enum', enum: DiscountCondition })
  condition: DiscountCondition;

  @ApiProperty()
  @Column({ type: 'enum', enum: DiscountCondition })
  resultCondition: DiscountCondition;

  @Column({ type: 'numeric', nullable })
  amount?: number;

  @Column({ type: 'numeric', nullable })
  resultAmount?: number;

  @ManyToOne(() => ProductSet, { nullable })
  productSet?: ProductSet;

  @ManyToOne(() => ProductSet, { nullable })
  resultProductSet?: ProductSet;
}
