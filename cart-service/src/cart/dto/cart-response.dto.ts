import {
  IsArray,
  IsNumber,
  IsString,
  Matches,
  Max,
  Min,
  ValidateNested,
} from 'class-validator';
import { CartItemDto } from './cart-item.dto';
import { Type } from 'class-transformer';

export class CartResponseDto {
  @IsString()
  shoppingCartId: string;

  @IsString()
  userId: string;

  @IsString()
  @Matches(/^\d+(\.\d{1,2})?$/, {
    message: 'totalPrice must be a valid number with up to 2 decimal places',
  })
  totalPrice: string;

  @IsNumber()
  @Min(0)
  @Max(1000000)
  totalQuantity: number;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CartItemDto)
  items: CartItemDto[];
}
