import Dinero from 'dinero.js';
import { CartItem } from '../modules/cart/model';

export function notUndefined<T>(x: T | undefined): x is T {
    return x !== undefined;
}

export function formatPrice(value: number): string {
    const price = Dinero({ amount: value, currency: 'EUR' });
    return price.toFormat();
}

export function calculateCartItemTotal({ product, quantity }: CartItem): number {
    return Dinero({ amount: product.price }).multiply(quantity).getAmount();
}

export function calculateAllCartItemsTotal(cartItems: CartItem[]): number {
    return cartItems.reduce((prev, cur) => {
        return Dinero({ amount: cur.product.price }).multiply(cur.quantity).add(Dinero({ amount: prev })).getAmount();
    }, 0);
}
