import { connect } from 'react-redux';
import { AppState } from '../store';
import { CartBox } from '../widgets/cart-box/cart-box';
import { getTotalItems } from '../modules/cart/selector';

const mapStateToProps = (state: AppState) => ({
    totalItems: getTotalItems(state.cart)
});

export const CartBoxContainer = connect(mapStateToProps)(CartBox);
