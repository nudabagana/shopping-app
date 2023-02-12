import { ApiProperty } from '@nestjs/swagger';

export class CartProduct {
  @ApiProperty() productUuid: string;
  @ApiProperty() count: number;
}

export class Cart {
  @ApiProperty({ type: [CartProduct] })
  products: CartProduct[];
}
