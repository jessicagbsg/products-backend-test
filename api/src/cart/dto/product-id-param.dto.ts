import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ProductIdParam {
  @ApiProperty({
    description: 'Product identifier',
    example: '192663',
  })
  @IsString()
  @IsNotEmpty()
  productId: string;
}
