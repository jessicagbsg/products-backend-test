import { IsString, Matches } from 'class-validator';

export class ProductDto {
  @IsString()
  productId: string;

  @IsString()
  @Matches(/^\d+(\.\d{1,2})?$/, {
    message: 'price must be a valid number with up to 2 decimal places',
  })
  price: string;
}
