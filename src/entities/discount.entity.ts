import { ApiProperty } from '@nestjs/swagger';
import { nullable } from 'src/consts';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { ProductSet, ProductSetBase } from './productSet.entity';

export enum DiscountType {
  TOTAL_MORE = 'total_more',
  TOTAL_LESS = 'total_less',
  ITEMS = 'items',
  SAME_ITEMS = 'same_items',
}

export enum DiscountCondition {
  MORE = 'more',
  MORE_PRC = 'more_prc',
  LESS = 'less',
  LESS_PRC = 'less_prc',
}

export class DiscountBase {
  @ApiProperty({ nullable, default: 0 })
  priority?: number;

  @ApiProperty({ nullable, default: true })
  isActive?: boolean;

  @ApiProperty()
  type: DiscountType;

  @ApiProperty()
  resultCondition: DiscountCondition;

  @ApiProperty({ nullable })
  amount?: number;

  @ApiProperty({ nullable })
  itemCount?: number;

  @ApiProperty()
  resultAmount: number;

  @ApiProperty({ type: ProductSetBase, nullable })
  productSet?: ProductSetBase;
}

@Entity()
export class Discount extends DiscountBase {
  @ApiProperty()
  @PrimaryGeneratedColumn('uuid')
  uuid: string;

  @ApiProperty()
  @Column({ default: 0 })
  priority: number;

  @ApiProperty()
  @Column({ default: true })
  isActive: boolean;

  @ApiProperty()
  @Column({ type: 'enum', enum: DiscountType })
  type: DiscountType;

  @ApiProperty()
  @Column({ type: 'enum', enum: DiscountCondition })
  resultCondition: DiscountCondition;

  @ApiProperty({ nullable })
  @Column({ type: 'numeric', nullable })
  amount?: number;

  @ApiProperty({ nullable })
  @Column({ nullable })
  itemCount?: number;

  @ApiProperty()
  @Column({ type: 'numeric' })
  resultAmount: number;

  @ApiProperty({ type: ProductSet, nullable })
  @ManyToOne(() => ProductSet, { nullable, cascade: true })
  productSet?: ProductSet;
}
