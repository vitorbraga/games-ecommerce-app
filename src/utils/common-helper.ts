import Dinero from 'dinero.js';

export function notUndefined<T>(x: T | undefined): x is T {
    return x !== undefined;
}

export function formatPrice(value: number): string {
    const price = Dinero({ amount: value, currency: 'EUR' });
    return price.toFormat();
}
