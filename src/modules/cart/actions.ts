import { Product } from '../products/model';
import { ADD_CART_ITEM, ActionTypes, REPLACE_CART_ITEM, CartItem, REMOVE_ITEM } from './model';

export function addCartItem(cartItem: CartItem): ActionTypes {
    return {
        type: ADD_CART_ITEM,
        payload: cartItem
    };
}

export function replaceCartItem(cartItem: CartItem): ActionTypes {
    return {
        type: REPLACE_CART_ITEM,
        payload: cartItem
    };
}

export function removeItem(product: Product): ActionTypes {
    return {
        type: REMOVE_ITEM,
        payload: product
    };
}
