import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { CartController } from './cart.controller';
import { CartService } from './cart.service';
import { ProductsModule } from '../products/products.module';

@Module({
  imports: [HttpModule, ProductsModule],
  controllers: [CartController],
  providers: [CartService],
  exports: [CartService],
})
export class CartModule {}
