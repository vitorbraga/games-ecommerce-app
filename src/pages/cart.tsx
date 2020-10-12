import React from 'react';
import { Dispatch } from 'redux';
import { connect } from 'react-redux';
import Router from 'next/router';
import FormControl from 'react-bootstrap/FormControl';
import Image from 'react-bootstrap/Image';
import { Layout } from '../components/layout/layout';
import { CartItem } from '../modules/cart/model';
import { AppState } from '../store';
import { getCartItems, getTotalItems } from '../modules/cart/selector';
import { generatePictureURL } from '../utils/api-helper';
import * as MoneyUtils from '../utils/money-utils';
import { Product } from '../modules/products/model';
import { removeItem, replaceCartItem } from '../modules/cart/actions';
import { CustomButton } from '../components/custom-buttom/custom-button';

import styles from './cart.module.scss';

interface Props {
    cartItems: CartItem[];
    totalItems: number;
    onRemoveProduct: (product: Product) => void;
    onReplaceCartItem: (cartItem: CartItem) => void;
}

interface State {
    justRemoved: Product | null;
}

class CartPage extends React.PureComponent<Props, State> {
    public state: State = {
        justRemoved: null
    };

    private handleChangeQuantity = (product: Product) => (event: React.FocusEvent<HTMLInputElement>) => {
        const quantity = parseInt(event.target.value, 10);
        if (!isNaN(quantity)) {
            if (quantity === 0) {
                this.setState({ justRemoved: product }, () => {
                    this.props.onRemoveProduct(product);
                });
            } else {
                this.setState({ justRemoved: null }, () => {
                    this.props.onReplaceCartItem({ product, quantity: quantity || 0 });
                });
            }
        }
    };

    private handleClickRemoveProduct = (product: Product) => () => {
        this.setState({ justRemoved: product }, () => {
            this.props.onRemoveProduct(product);
        });
    };

    private renderProductsTable() {
        const { cartItems, totalItems } = this.props;
        const { justRemoved } = this.state;

        if (totalItems === 0) {
            return (
                <div className={styles['empty-state']}>Your cart is currently empty.</div>
            );
        }

        return (
            <table className={styles['products-table']}>
                <thead>
                    <tr>
                        <th className={styles['th-product']}>Product</th>
                        <th>Price</th>
                        <th>Quantity</th>
                        <th>Total</th>
                    </tr>
                </thead>
                <tbody>
                    {justRemoved
                        && <tr>
                            <td colSpan={4}>
                                <div>Removed: <a href={`/products/${justRemoved.id}`}>{justRemoved.title}</a> from your cart.</div>
                            </td>
                        </tr>
                    }
                    {cartItems.map(({ product, quantity }, index) => {
                        const imagePath = generatePictureURL(product.pictures[0]?.filename);
                        const cartItemTotal = MoneyUtils.calculateCartItemTotal({ product, quantity });

                        return (
                            <tr key={`product-row-${index}`}>
                                <td className={styles['td-product']}>
                                    <div className={styles['product-info']}>
                                        <Image className={styles['product-picture']} src={imagePath} alt={product.title} />
                                        <div className={styles['product-title']}>
                                            <div>{product.title}</div>
                                            <div><a className={styles.link} onClick={this.handleClickRemoveProduct(product)}>Remove</a></div>
                                        </div>
                                    </div>
                                </td>
                                <td className={styles['aligned-end']}>
                                    {MoneyUtils.formatPrice(product.price)}
                                </td>
                                <td className={styles['aligned-end']}>
                                    <div className={styles['quantity-input']}>
                                        <FormControl
                                            style={{ width: '70px' }}
                                            type="number"
                                            min="0"
                                            value={quantity}
                                            max={product.quantityInStock}
                                            onChange={this.handleChangeQuantity(product)}
                                        />
                                    </div>
                                </td>
                                <td className={styles['aligned-end']}>
                                    {MoneyUtils.formatPrice(cartItemTotal)}
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        );
    }

    private handleClickGoToCheckout = () => {
        Router.push('/checkout');
    };

    private renderSummaryAndCheckout() {
        const { totalItems } = this.props;
        const subtotal = MoneyUtils.calculateAllItemsTotal(this.props.cartItems);

        if (totalItems > 0) {
            return (
                <div className={styles['summary-wrapper']}>
                    <div className={styles['subtotal-wrapper']}>
                        <div>Subtotal</div>
                        <div className={styles.value}>{MoneyUtils.formatPrice(subtotal)}</div>
                    </div>
                    <div className={styles['shipping-info']}>Taxes and shipping calculated at checkout</div>
                    <div className={styles['checkout-wrapper']}>
                        <CustomButton variant="primary" onClick={this.handleClickGoToCheckout}>Proceed to Checkout</CustomButton>
                    </div>
                </div>
            );
        }
    }

    public render() {
        return (
            <Layout title="Shopping cart" showNav>
                <div className={styles['cart-container']}>
                    <h1 className={styles['page-title']}>Your cart</h1>
                    {this.renderProductsTable()}
                    {this.renderSummaryAndCheckout()}
                </div>
            </Layout>
        );
    }
};

const mapStateToProps = (state: AppState) => ({
    cartItems: getCartItems(state.cart),
    totalItems: getTotalItems(state.cart)
});

const mapDispatchToProps = (dispatch: Dispatch) => ({
    onRemoveProduct: (product: Product) => dispatch(removeItem(product)),
    onReplaceCartItem: (cartItem: CartItem) => dispatch(replaceCartItem(cartItem))
});

export default connect(mapStateToProps, mapDispatchToProps)(CartPage);
