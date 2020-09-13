import { Product } from '../products/model';
import { ADD_PRODUCT, DECREASE_PRODUCT, ActionTypes, SET_ADDED_PRODUCT, CartItem, REMOVE_ITEM } from './model';

export function addProduct(product: Product): ActionTypes {
    return {
        type: ADD_PRODUCT,
        payload: product
    };
}

export function decreaseProduct(product: Product): ActionTypes {
    return {
        type: DECREASE_PRODUCT,
        payload: product
    };
}

export function setAddedProduct(cartItem: CartItem): ActionTypes {
    return {
        type: SET_ADDED_PRODUCT,
        payload: cartItem
    };
}

export function removeItem(product: Product): ActionTypes {
    return {
        type: REMOVE_ITEM,
        payload: product
    };
}
