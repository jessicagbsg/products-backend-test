import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Matches } from 'class-validator';
import { Document } from 'mongoose';

export type ProductDocument = Product & Document;

@Schema({ timestamps: true })
export class Product {
  @Prop({ required: true, unique: true })
  productId: string;

  @Prop({ required: true })
  @Matches(/^\d+(\.\d{1,2})?$/, {
    message: 'price must be a valid number with up to 2 decimal places',
  })
  price: string;
}

export const ProductSchema = SchemaFactory.createForClass(Product);
