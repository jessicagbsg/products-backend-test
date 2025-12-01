import { IsNumber, IsString, Matches, Min, Max } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CartItemDto {
  @ApiProperty({
    description: 'Unique product identifier',
    example: '192663',
  })
  @IsString()
  productId: string;

  @ApiProperty({
    description: 'Product price in string format with up to 2 decimal places',
    example: '267.00',
    pattern: '^\\d+(\\.\\d{1,2})?$',
  })
  @IsString()
  @Matches(/^\d+(\.\d{1,2})?$/, {
    message: 'price must be a valid number with up to 2 decimal places',
  })
  price: string;

  @ApiProperty({
    description: 'Quantity of products in cart',
    example: 2,
    minimum: 1,
    maximum: 100,
  })
  @IsNumber()
  @Min(1)
  @Max(100)
  quantity: number;
}
