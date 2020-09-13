import { Product } from '../products/model';

// FIXME Find a better name than AddedProduct
export const ADD_PRODUCT = 'ADD_PRODUCT';
export const DECREASE_PRODUCT = 'DECREASE_PRODUCT';
export const SET_ADDED_PRODUCT = 'SET_ADDED_PRODUCT';
export const REMOVE_ITEM = 'REMOVE_ITEM';

interface AddProductAction { type: typeof ADD_PRODUCT, payload: Product }
interface DecreaseProductAction { type: typeof DECREASE_PRODUCT, payload: Product }
interface SetAddedProductAction { type: typeof SET_ADDED_PRODUCT, payload: CartItem }
interface RemoveItemAction { type: typeof REMOVE_ITEM, payload: Product }

export interface CartItem {
    product: Product;
    quantity: number;
}

export interface CartState {
    items: CartItem[];
    totalItems: number;
}

export type ActionTypes = AddProductAction | DecreaseProductAction | SetAddedProductAction | RemoveItemAction;
