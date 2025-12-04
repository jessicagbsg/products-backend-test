import { IsInt, IsNotEmpty, IsString, Max, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CartItemDto {
  @ApiProperty({
    description: 'Unique product identifier',
    example: '192663',
  })
  @IsString()
  @IsNotEmpty()
  productId: string;

  @ApiProperty({
    description: 'Quantity of products to add to cart',
    example: 2,
    minimum: 1,
    maximum: 100,
  })
  @IsInt()
  @IsNotEmpty()
  @Min(1)
  @Max(100)
  quantity: number;
}
