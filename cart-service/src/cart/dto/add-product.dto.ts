import {
  IsInt,
  IsNotEmpty,
  IsString,
  Matches,
  Max,
  Min,
} from 'class-validator';

export class AddProductDto {
  @IsString()
  @IsNotEmpty()
  productId: string;

  @IsString()
  @IsNotEmpty()
  @Matches(/^\d+(\.\d{1,2})?$/, {
    message: 'price must be a valid number with up to 2 decimal places',
  })
  price: string;

  @IsInt()
  @IsNotEmpty()
  @Min(1)
  @Max(100)
  quantity: number;
}
