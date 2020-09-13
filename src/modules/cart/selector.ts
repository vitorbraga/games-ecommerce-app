import { CartState, CartItem } from './model';

export const getCartItems = (state: CartState): CartItem[] => state.items;

export const getTotalItems = (state: CartState): number => state.totalItems;
