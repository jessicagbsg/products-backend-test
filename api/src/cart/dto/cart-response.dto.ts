import {
  IsArray,
  IsInt,
  IsString,
  Matches,
  IsNotEmpty,
  Max,
  Min,
  ValidateNested,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { CartItemDto } from './cart-item.dto';

export class CartResponseDto {
  @ApiProperty({
    description: 'Unique shopping cart identifier',
    example: 'cart-uuid-123',
  })
  @IsString()
  @IsNotEmpty()
  shoppingCartId: string;

  @ApiProperty({
    description: 'User identifier',
    example: 'user-123',
  })
  @IsString()
  @IsNotEmpty()
  userId: string;

  @ApiProperty({
    description: 'Total price of all items in cart',
    example: '534.00',
    pattern: '^\\d+(\\.\\d{1,2})?$',
  })
  @IsString()
  @IsNotEmpty()
  @Matches(/^\d+(\.\d{1,2})?$/, {
    message: 'totalPrice must be a valid number with up to 2 decimal places',
  })
  totalPrice: string;

  @ApiProperty({
    description: 'Total quantity of items in cart',
    example: 2,
    minimum: 0,
    maximum: 1000000,
  })
  @IsInt()
  @IsNotEmpty()
  @Min(0)
  @Max(1000000)
  totalQuantity: number;

  @ApiProperty({
    description: 'List of items in the cart',
    type: [CartItemDto],
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CartItemDto)
  items: CartItemDto[];
}
