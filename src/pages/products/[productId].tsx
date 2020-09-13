import * as React from 'react';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import Router from 'next/router';
import classNames from 'classnames';
import Carousel from 'react-bootstrap/Carousel';
import Spinner from 'react-bootstrap/Spinner';
import { Layout } from '../../components/layout';
import * as ProductApi from '../../modules/products/api';
import { Product } from '../../modules/products/model';
import { FetchStatus, FetchStatusEnum, generatePictureURL } from '../../utils/api-helper';
import { formatPrice } from '../../utils/common-helper';
import { Badge, FormControl, Image } from 'react-bootstrap';
import Toast from 'react-bootstrap/Toast';
import { CustomButton } from '../../widgets/custom-buttom/custom-button';
import { AppState } from '../../store';
import { getTotalItems } from '../../modules/cart/selector';
import { addProduct } from '../../modules/cart/actions';

import styles from './[productId].module.scss';

interface Props {
    query: {
        productId: string;
    };
    totalItems: number;
    addProduct: (product: Product) => void;
    count: () => void;
}

interface State {
    fetchStatus: FetchStatus;
    product: Product | null;
    activeCarouselItem: number;
    showAddedToCartToast: boolean;
}

class ProductDetails extends React.PureComponent<Props, State> {
    public state: State = {
        fetchStatus: FetchStatusEnum.initial,
        product: null,
        activeCarouselItem: 0,
        showAddedToCartToast: true
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
        if (this.state.product) {
            this.props.addProduct(this.state.product);
            this.handleShowToast();
            // TODO show Toast with cart info
        }
    };

    private renderProductContent() {
        const { product, fetchStatus, activeCarouselItem } = this.state;

        if (fetchStatus === FetchStatusEnum.loading) {
            return <Spinner animation="border" variant="info" />;
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
                            style={{ width: '100%', marginTop: '20px' }}
                            type="number"
                            min="1"
                            max={product.quantityInStock}
                            placeholder="Quantity"
                        />
                        <CustomButton variant="primary" onClick={this.handleClickAddProduct}>Add to cart</CustomButton>
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
        // TODO update "Qty"
        const { product } = this.state;

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
                                <div className={styles.quantity}>Qty: 1</div>
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
    addProduct: (product: Product) => dispatch(addProduct(product))
});

export default connect(mapStateToProps, mapDispatchToProps)(ProductDetails);
