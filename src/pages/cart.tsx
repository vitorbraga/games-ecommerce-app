import React from 'react';
import { Dispatch } from 'redux';
import { connect } from 'react-redux';
import { Layout } from '../components/layout';
import { CartItem } from '../modules/cart/model';
import { AppState } from '../store';
import { getCartItems, getTotalItems } from '../modules/cart/selector';
import { FormControl, Image } from 'react-bootstrap';
import { generatePictureURL } from '../utils/api-helper';
import { formatPrice } from '../utils/common-helper';
import { Product } from '../modules/products/model';
import { removeItem, setAddedProduct } from '../modules/cart/actions';
import { CustomButton } from '../widgets/custom-buttom/custom-button';

import styles from './cart.module.scss';

interface Props {
    cartItems: CartItem[];
    totalItems: number;
    onRemoveProduct: (product: Product) => void;
    onSetAddedProduct: (addedProduct: CartItem) => void;
}

interface State {
    justRemoved: Product | null;
}

class CartPage extends React.PureComponent<Props, State> {
    public state: State = {
        justRemoved: null
    };

    private calculateAddedProductTotal(addedProduct: CartItem): number {
        // TODO use dinero
        return addedProduct.product.price * addedProduct.quantity;
    }

    private calculateAllAddedProductsTotal(addedProducts: CartItem[]): number {
        // TODO use dinero
        return addedProducts.reduce((prev, cur) => prev + (cur.product.price * cur.quantity), 0);
        // return addedProduct.product.price * addedProduct.quantity;
    }

    private handleChangeQuantity = (product: Product) => (event: React.FocusEvent<HTMLInputElement>) => {
        const quantity = parseInt(event.target.value, 10);
        if (!isNaN(quantity)) {
            if (quantity === 0) {
                this.setState({ justRemoved: product }, () => {
                    this.props.onRemoveProduct(product);
                });
            } else {
                this.props.onSetAddedProduct({ product, quantity: quantity || 0 });
            }
        }
    };

    private handleClickRemoveProduct = (product: Product) => () => {
        this.setState({ justRemoved: product }, () => {
            this.props.onRemoveProduct(product);
        });
        // TODO like in https://www.drysteppers.com/, when remove show item you just removed above the table
    };

    private renderProductsTable() {
        const { cartItems, totalItems } = this.props;
        const { justRemoved } = this.state;

        if (totalItems === 0) {
            return (
                <div>Your cart is currently empty.</div>
            );
        }

        return (
            <table className={styles['products-table']}>
                {/* FIXME improve style, create CSS classes */}
                <thead>
                    <tr>
                        <th style={{ width: '800px' }}>Product</th>
                        <th style={{ textAlign: 'end' }}>Price</th>
                        <th style={{ textAlign: 'end' }}>Quantity</th>
                        <th style={{ textAlign: 'end' }}>Total</th>
                    </tr>
                </thead>
                <tbody>
                    {justRemoved
                        && <tr>
                            <td colSpan={4}>
                                <div>You just removed: <a href={`/products/${justRemoved.id}`}>{justRemoved.title}</a></div>
                            </td>
                        </tr>
                    }
                    {cartItems.map(({ product, quantity }, index) => {
                        const imagePath = generatePictureURL(product.pictures[0].filename);
                        const addedProductTotal = this.calculateAddedProductTotal({ product, quantity });

                        return (
                            <tr key={`product-row-${index}`}>
                                <td>
                                    <div className={styles['product-info']}>
                                        <Image className={styles['product-picture']} src={imagePath} />
                                        <div className={styles['product-title']}>
                                            <div>{product.title}</div>
                                            <div><a className={styles.link} onClick={this.handleClickRemoveProduct(product)}>Remove</a></div>
                                        </div>
                                    </div>
                                </td>
                                <td style={{ textAlign: 'end' }}>{formatPrice(product.price)}</td>
                                <td style={{ textAlign: 'end' }}>
                                    <div style={{ display: 'flex', width: '100%', justifyContent: 'flex-end' }}>
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
                                <td style={{ textAlign: 'end' }}>{formatPrice(addedProductTotal)}</td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        );
    }

    private renderSummaryAndCheckout() {
        const { totalItems } = this.props;
        const subtotal = this.calculateAllAddedProductsTotal(this.props.cartItems);

        if (totalItems > 0) {
            return (
                <div className={styles['summary-wrapper']}>
                    <div className={styles['subtotal-wrapper']}>
                        <div>Subtotal</div>
                        <div className={styles.value}>{formatPrice(subtotal)}</div>
                    </div>
                    <div className={styles['shipping-info']}>Taxes and shipping calculated at checkout</div>
                    <div className={styles['checkout-wrapper']}>
                        <CustomButton variant="primary">Proceed to Checkout</CustomButton>
                    </div>
                </div>
            );
        }
    }

    public render() {
        return (
            <Layout title="Shopping cart" showNav={true}>
                <div className={styles['cart-container']}>
                    <h1 style={{ textAlign: 'center', marginTop: '30px' }}>Your cart</h1>
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
    onSetAddedProduct: (addedProduct: CartItem) => dispatch(setAddedProduct(addedProduct))
});

export default connect(mapStateToProps, mapDispatchToProps)(CartPage);
