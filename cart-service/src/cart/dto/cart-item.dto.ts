import { IsNumber, IsString, Matches, Min, Max } from 'class-validator';

export class CartItemDto {
  @IsString()
  productId: string;

  @IsString()
  @Matches(/^\d+(\.\d{1,2})?$/, {
    message: 'price must be a valid number with up to 2 decimal places',
  })
  price: string;

  @IsNumber()
  @Min(1)
  @Max(100)
  quantity: number;
}
