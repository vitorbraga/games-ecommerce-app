import { ADD_PRODUCT, DECREASE_PRODUCT, SET_ADDED_PRODUCT, REMOVE_ITEM, ActionTypes, CartState, CartItem } from './model';

const initialState: CartState = {
    items: [],
    totalItems: 0
};

function tallyOfAllItems(items: CartItem[]): number {
    return items.reduce((prev, cur) => prev + cur.quantity, 0);
};

export function cartReducer(state = initialState, action: ActionTypes): CartState {
    switch (action.type) {
        case ADD_PRODUCT: {
            const stateCopy = { ...state };

            const newProduct = action.payload;
            const productAlreadyAdded = stateCopy.items.find((item) => item.product.id === newProduct.id);
            if (productAlreadyAdded) {
                productAlreadyAdded.quantity = productAlreadyAdded.quantity + 1;
                return {
                    ...stateCopy,
                    totalItems: tallyOfAllItems(stateCopy.items)
                };
            } else {
                const addedProducts = [...stateCopy.items, { product: newProduct, quantity: 1 }];
                return {
                    ...stateCopy,
                    items: addedProducts,
                    totalItems: tallyOfAllItems(addedProducts)
                };
            }
        }
        case DECREASE_PRODUCT: {
            let stateCopy = { ...state };
            const productToBeRemoved = action.payload;
            const productAdded = stateCopy.items.find((item) => item.product.id === productToBeRemoved.id);

            if (productAdded) {
                if (productAdded.quantity === 0) {
                    stateCopy = {
                        ...stateCopy,
                        items: [...stateCopy.items.filter((item) => item.product.id === productToBeRemoved.id)]
                    };
                } else {
                    productAdded.quantity = productAdded.quantity - 1;
                }
            }

            return stateCopy;
        }
        case SET_ADDED_PRODUCT: {
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
                const addedProducts = [...stateCopy.items, { product, quantity }];
                return {
                    ...stateCopy,
                    items: addedProducts,
                    totalItems: tallyOfAllItems(addedProducts)
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
