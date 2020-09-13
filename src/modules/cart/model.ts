import { Product } from '../products/model';

export const ADD_CART_ITEM = 'ADD_CART_ITEM';
export const REPLACE_CART_ITEM = 'REPLACE_CART_ITEM';
export const REMOVE_ITEM = 'REMOVE_ITEM';

interface AddProductAction { type: typeof ADD_CART_ITEM, payload: CartItem }
interface ReplaceCartItemAction { type: typeof REPLACE_CART_ITEM, payload: CartItem }
interface RemoveItemAction { type: typeof REMOVE_ITEM, payload: Product }

export interface CartItem {
    product: Product;
    quantity: number;
}

export interface CartState {
    items: CartItem[];
    totalItems: number;
}

export type ActionTypes = AddProductAction | ReplaceCartItemAction | RemoveItemAction;
