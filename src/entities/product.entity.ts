import { ApiProperty } from '@nestjs/swagger';
import { nullable } from 'src/consts';
import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

export class ProductBase {
  @ApiProperty()
  name: string;

  @ApiProperty()
  description: string;

  @ApiProperty({ nullable })
  imgUrl?: string;

  @ApiProperty()
  price: number;
}

@Entity()
export class Product extends ProductBase {
  @ApiProperty()
  @PrimaryGeneratedColumn('uuid')
  uuid: string;

  @ApiProperty()
  @Column()
  name: string;

  @ApiProperty()
  @Column()
  description: string;

  @ApiProperty({ nullable })
  @Column({ nullable })
  imgUrl?: string;

  @ApiProperty()
  @Column({ type: 'numeric' })
  price: number;
}
