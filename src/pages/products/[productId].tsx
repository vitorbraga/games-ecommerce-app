import * as React from 'react';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import Router from 'next/router';
import classNames from 'classnames';
import Carousel from 'react-bootstrap/Carousel';
import Badge from 'react-bootstrap/Badge';
import FormControl from 'react-bootstrap/FormControl';
import Image from 'react-bootstrap/Image';
import Toast from 'react-bootstrap/Toast';
import { Layout } from '../../components/layout/layout';
import * as ProductApi from '../../modules/products/api';
import { Product } from '../../modules/products/model';
import { FetchStatus, FetchStatusEnum, generatePictureURL } from '../../utils/api-helper';
import { formatPrice } from '../../utils/money-utils';
import { CustomButton } from '../../components/custom-buttom/custom-button';
import { AppState } from '../../store';
import { getTotalItems } from '../../modules/cart/selector';
import { addCartItem } from '../../modules/cart/actions';
import { CartItem } from '../../modules/cart/model';
import { CustomSpinner } from '../../components/custom-spinner/custom-spinner';

import styles from './[productId].module.scss';

interface Props {
    query: {
        productId: string;
    };
    totalItems: number;
    onAddCartItem: (cartItem: CartItem) => void;
    count: () => void;
}

interface State {
    fetchStatus: FetchStatus;
    product: Product | null;
    quantity: number;
    activeCarouselItem: number;
    showAddedToCartToast: boolean;
}

class ProductDetails extends React.PureComponent<Props, State> {
    public state: State = {
        fetchStatus: FetchStatusEnum.initial,
        product: null,
        quantity: 1,
        activeCarouselItem: 0,
        showAddedToCartToast: false
    };

    public componentDidMount() {
        const { query: { productId } } = this.props;
        this.setState({ fetchStatus: FetchStatusEnum.loading }, async () => {
            try {
                const product = await ProductApi.getProduct(productId);
                this.setState({ fetchStatus: FetchStatusEnum.success, product });
            } catch (error) {
                this.setState({ fetchStatus: FetchStatusEnum.failure });
            }
        });
    }

    private handleSelectCarousel = (selectedIndex: number) => {
        this.setState({ activeCarouselItem: selectedIndex });
    };

    private handleClickAddProduct = () => {
        const { product, quantity } = this.state;
        if (product) {
            this.props.onAddCartItem({ product, quantity });
            this.handleShowToast();
        }
    };

    private handleChangeQuantity = (event: React.ChangeEvent<HTMLInputElement>) => {
        this.setState({ quantity: parseInt(event.target.value, 10) });
    };

    private renderProductContent() {
        const { product, fetchStatus, activeCarouselItem, quantity } = this.state;

        if (fetchStatus === FetchStatusEnum.loading) {
            return <CustomSpinner />;
        } else if (product === null) {
            return <div>Product not found</div>;
        } else {
            return (
                <div className={styles.product}>
                    <div className={styles['product-view']}>
                        <Carousel activeIndex={activeCarouselItem} onSelect={this.handleSelectCarousel}>
                            {product.pictures.map((picture, index) => {
                                const imagePath = generatePictureURL(picture.filename);

                                return (
                                    <Carousel.Item key={`carousel-item-${index}`} className="img-fluid">
                                        <img
                                            className={classNames('d-block', styles.image)}
                                            src={imagePath}
                                            alt={`Picture of ${product.title}`}
                                        />
                                    </Carousel.Item>
                                );
                            })}
                        </Carousel>
                    </div>
                    <div className={styles['product-info']}>
                        <div className={styles.title}>{product.title}</div>
                        <div className={styles.price}>{formatPrice(product.price)}</div>
                        <div className={styles.description}>{product.description}</div>
                        <div className={styles['tags-wrapper']}>
                            {product.tags.split(',').map((tag, index) => {
                                return <Badge variant="primary" key={`tag-${index}`} className={styles.tag}>{tag}</Badge>;
                            })}
                        </div>
                        <FormControl
                            className={styles['quantity-input']}
                            type="number"
                            min="1"
                            max={product.quantityInStock}
                            value={quantity}
                            onChange={this.handleChangeQuantity}
                            placeholder="Quantity"
                        />
                        <CustomButton
                            className={styles['add-product-button']}
                            variant="primary"
                            onClick={this.handleClickAddProduct}
                        >
                            Add to cart
                        </CustomButton>
                    </div>
                </div>
            );
        }
    }

    private handleShowToast = () => {
        this.setState({ showAddedToCartToast: true });
    };

    private handleCloseToast = () => {
        this.setState({ showAddedToCartToast: false });
    };

    private handleClickViewCart = () => {
        Router.push('/cart');
    };

    private renderAddedToCartToast() {
        const { product, quantity } = this.state;

        if (product) {
            const picturePath = generatePictureURL(product.pictures[0].filename);

            return (
                <Toast
                    className={styles['added-to-cart-toast']}
                    show={this.state.showAddedToCartToast}
                    onClose={this.handleCloseToast}
                >
                    <Toast.Header className={styles['toast-header']}>
                        <div>JUST ADDED TO YOUR CART</div>
                    </Toast.Header>
                    <Toast.Body className={styles['toast-body']}>
                        <div>
                            <div className={styles['last-added-product']}>
                                <Image className={styles['product-picture']} src={picturePath}/>
                                <div className={styles['product-title']}>
                                    {product.title}
                                </div>
                                <div className={styles.quantity}>Qty: {quantity}</div>
                            </div>
                            <CustomButton
                                variant="secondary"
                                className={styles['view-cart-button']}
                                onClick={this.handleClickViewCart}
                            >
                                View cart ({this.props.totalItems})
                            </CustomButton>
                        </div>
                    </Toast.Body>
                </Toast>
            );
        }
    }

    public render() {
        const { product } = this.state;
        const title = product ? product.title : 'Product details';

        return (
            <Layout title={title} showNav>
                <div className={styles['product-details-container']}>
                    {this.renderProductContent()}
                </div>
                {this.renderAddedToCartToast()}
            </Layout>
        );
    }

    static getInitialProps({ query }: Props) {
        return { query };
    }
};

const mapStateToProps = (state: AppState) => ({
    totalItems: getTotalItems(state.cart)
});

const mapDispatchToProps = (dispatch: Dispatch) => ({
    onAddCartItem: (cartItem: CartItem) => dispatch(addCartItem(cartItem))
});

export default connect(mapStateToProps, mapDispatchToProps)(ProductDetails);
