import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Cart } from './entities/cart.entity';
import { CartItem } from './entities/cart-item.entity';
import { AddProductDto } from './dto/add-product.dto';
import { CartResponseDto } from './dto/cart-response.dto';
import { CartItemDto } from './dto/cart-item.dto';

@Injectable()
export class CartService {
  constructor(
    @InjectRepository(Cart)
    private cartRepository: Repository<Cart>,
    @InjectRepository(CartItem)
    private cartItemRepository: Repository<CartItem>,
  ) {}

  async getCart(userId: string): Promise<CartResponseDto> {
    let cart = await this.cartRepository.findOne({
      where: { userId },
      relations: ['items'],
    });

    if (!cart) {
      cart = this.cartRepository.create({
        userId,
        totalPrice: '0.00',
        totalQuantity: 0,
        items: [],
      });
      cart = await this.cartRepository.save(cart);
    }

    return this.mapToCartResponseDto(cart);
  }

  async addProduct(
    userId: string,
    addProductDto: AddProductDto,
  ): Promise<CartResponseDto> {
    let cart = await this.cartRepository.findOne({
      where: { userId },
      relations: ['items'],
    });

    if (!cart) {
      cart = this.cartRepository.create({
        userId,
        totalPrice: '0.00',
        totalQuantity: 0,
        items: [],
      });
      cart = await this.cartRepository.save(cart);
    }

    const existingItem = cart.items.find(
      (item) => item.productId === addProductDto.productId,
    );

    if (existingItem) {
      existingItem.quantity += addProductDto.quantity;
      await this.cartItemRepository.save(existingItem);
    } else {
      const newItem = this.cartItemRepository.create({
        productId: addProductDto.productId,
        price: addProductDto.price,
        quantity: addProductDto.quantity,
        cart,
      });
      cart.items.push(await this.cartItemRepository.save(newItem));
    }

    this.calculateCartTotalPrice(cart);
    cart = await this.cartRepository.save(cart);

    return this.mapToCartResponseDto(cart);
  }

  async removeProduct(
    userId: string,
    productId: string,
  ): Promise<CartResponseDto> {
    const cart = await this.cartRepository.findOne({
      where: { userId },
      relations: ['items'],
    });

    if (!cart) {
      throw new NotFoundException('Cart not found');
    }

    const itemIndex = cart.items.findIndex(
      (item) => item.productId === productId,
    );

    if (itemIndex === -1) {
      throw new NotFoundException('Product not found in cart');
    }

    const item = cart.items[itemIndex];
    if (item.quantity > 1) {
      item.quantity -= 1;
      await this.cartItemRepository.save(item);
    } else {
      await this.cartItemRepository.remove(item);
      cart.items.splice(itemIndex, 1);
    }

    this.calculateCartTotalPrice(cart);
    await this.cartRepository.save(cart);

    return this.mapToCartResponseDto(cart);
  }

  private calculateCartTotalPrice(cart: Cart): void {
    let totalPrice = 0;
    let totalQuantity = 0;

    for (const item of cart.items) {
      const itemPrice = parseFloat(item.price);
      const itemTotal = itemPrice * item.quantity;
      totalPrice += itemTotal;
      totalQuantity += item.quantity;
    }

    cart.totalPrice = totalPrice.toFixed(2);
    cart.totalQuantity = totalQuantity;
  }

  private mapToCartResponseDto(cart: Cart): CartResponseDto {
    const items: CartItemDto[] = cart.items.map((item) => ({
      productId: item.productId,
      price: item.price,
      quantity: item.quantity,
    }));

    return {
      shoppingCartId: cart.id,
      userId: cart.userId,
      totalPrice: cart.totalPrice,
      totalQuantity: cart.totalQuantity,
      items,
    };
  }
}
