import { ADD_CART_ITEM, REPLACE_CART_ITEM, REMOVE_ITEM, ActionTypes, CartState, CartItem } from './model';

const initialState: CartState = {
    items: [],
    totalItems: 0
};

function tallyOfAllItems(items: CartItem[]): number {
    return items.reduce((prev, cur) => prev + cur.quantity, 0);
};

export function cartReducer(state = initialState, action: ActionTypes): CartState {
    switch (action.type) {
        case ADD_CART_ITEM: {
            const stateCopy = { ...state };

            const newCartItem = action.payload;
            const cartItemAlreadyAdded = stateCopy.items.find((item) => item.product.id === newCartItem.product.id);
            if (cartItemAlreadyAdded) {
                cartItemAlreadyAdded.quantity = cartItemAlreadyAdded.quantity + newCartItem.quantity;
                return {
                    ...stateCopy,
                    totalItems: tallyOfAllItems(stateCopy.items)
                };
            } else {
                const cartItems = [...stateCopy.items, newCartItem];
                return {
                    ...stateCopy,
                    items: cartItems,
                    totalItems: tallyOfAllItems(cartItems)
                };
            }
        }
        case REPLACE_CART_ITEM: {
            const stateCopy = { ...state };
            const { product, quantity } = action.payload;
            const productAlreadyAdded = stateCopy.items.find((item) => item.product.id === product.id);

            if (productAlreadyAdded) {
                productAlreadyAdded.quantity = quantity;
                return {
                    ...stateCopy,
                    totalItems: tallyOfAllItems(stateCopy.items)
                };
            } else {
                const cartItems = [...stateCopy.items, { product, quantity }];
                return {
                    ...stateCopy,
                    items: cartItems,
                    totalItems: tallyOfAllItems(cartItems)
                };
            }
        }
        case REMOVE_ITEM: {
            const cartItems = state.items.filter((item) => item.product.id !== action.payload.id);
            return {
                ...state,
                items: cartItems,
                totalItems: tallyOfAllItems(cartItems)
            };
        }
        default:
            return state;
    }
}
