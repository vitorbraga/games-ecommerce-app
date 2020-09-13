import { connect } from 'react-redux';
import { AppState } from '../store';
import { addedProducts, getTotal } from '../modules/cart/selector';
import CartPage from '../pages/cart';

const mapStateToProps = (state: AppState) => ({
    addedProducts: addedProducts(state.cart),
    total: getTotal(state.cart)
});

export const CartBoxContainer = connect(mapStateToProps)(CartPage);
