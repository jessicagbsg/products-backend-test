import { IsNotEmpty, IsString } from 'class-validator';

export class ProductIdParam {
  @IsString()
  @IsNotEmpty()
  productId: string;
}
