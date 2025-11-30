import { NestFactory } from '@nestjs/core';
import { getModelToken } from '@nestjs/mongoose';
import { AppModule } from '../../app.module';
import { Product, ProductDocument } from './product.schema';
import { Model } from 'mongoose';
import { ProductDto } from '../dto/product.dto';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const productModel = app.get<Model<ProductDocument>>(
    getModelToken(Product.name),
  );

  const sampleProducts: ProductDto[] = [];

  for (let i = 0; i < 100; i++) {
    const integerPart = Math.floor(Math.random() * 1000);
    const decimalPart = Math.floor(Math.random() * 100);
    const price = `${integerPart}.${decimalPart.toString().padStart(2, '0')}`;

    sampleProducts.push({
      productId: `${i + 1}`,
      price,
    });
  }

  console.log('🌱 Starting seed process...');

  try {
    let created = 0;
    let skipped = 0;

    for (const product of sampleProducts) {
      const existingProduct = await productModel.findOne({
        productId: product.productId,
      });

      if (!existingProduct) {
        await productModel.create(product);
        console.log(
          `✅ Created product: ${product.productId} - $${product.price}`,
        );
        created++;
      } else {
        console.log(
          `⏭️  Product ${product.productId} already exists, skipping...`,
        );
        skipped++;
      }
    }

    console.log('\n📊 Seed Summary:');
    console.log(`   Created: ${created} products`);
    console.log(`   Skipped: ${skipped} products`);
    console.log('✨ Seed completed successfully!');
  } catch (error) {
    console.error('❌ Error seeding products:', error);
    process.exit(1);
  }

  await app.close();
}

bootstrap().catch((error) => {
  console.error('Failed to run seed:', error);
  process.exit(1);
});
