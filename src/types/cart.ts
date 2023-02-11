import { ApiProperty } from '@nestjs/swagger';

export class CartItem {
  @ApiProperty() productUuid: string;
  @ApiProperty() count: number;
}

export class Cart {
  @ApiProperty({ type: [CartItem] })
  products: CartItem[];
}
