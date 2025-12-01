import {
  IsInt,
  IsNotEmpty,
  IsString,
  Matches,
  Max,
  Min,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class AddProductDto {
  @ApiProperty({
    description: 'Unique product identifier',
    example: '192663',
  })
  @IsString()
  @IsNotEmpty()
  productId: string;

  @ApiProperty({
    description: 'Product price in string format with up to 2 decimal places',
    example: '267.00',
    pattern: '^\\d+(\\.\\d{1,2})?$',
  })
  @IsString()
  @IsNotEmpty()
  @Matches(/^\d+(\.\d{1,2})?$/, {
    message: 'price must be a valid number with up to 2 decimal places',
  })
  price: string;

  @ApiProperty({
    description: 'Quantity of products to add',
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
