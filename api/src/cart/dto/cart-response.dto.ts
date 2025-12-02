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
import { Type } from 'class-transformer';
import { CartItemDto } from './cart-item.dto';

export class CartResponseDto {
  @IsString()
  @IsNotEmpty()
  shoppingCartId: string;

  @IsString()
  @IsNotEmpty()
  userId: string;

  @IsString()
  @IsNotEmpty()
  @Matches(/^\d+(\.\d{1,2})?$/, {
    message: 'totalPrice must be a valid number with up to 2 decimal places',
  })
  totalPrice: string;

  @IsInt()
  @IsNotEmpty()
  @Min(0)
  @Max(1000000)
  totalQuantity: number;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CartItemDto)
  items: CartItemDto[];
}
