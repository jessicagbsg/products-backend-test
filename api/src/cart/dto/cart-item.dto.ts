import { IsInt, IsNotEmpty, IsString, Max, Min } from 'class-validator';

export class CartItemDto {
  @IsString()
  @IsNotEmpty()
  productId: string;

  @IsInt()
  @IsNotEmpty()
  @Min(1)
  @Max(100)
  quantity: number;
}
