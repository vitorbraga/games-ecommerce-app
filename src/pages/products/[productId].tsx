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
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Container from 'react-bootstrap/Container';
import { Layout } from '../../components/layout/layout';
import * as ProductApi from '../../modules/products/api';
import * as Model from '../../modules/products/model';
import { FetchStatus, FetchStatusEnum, generatePictureURL } from '../../utils/api-helper';
import { formatPrice } from '../../utils/money-utils';
import { CustomButton } from '../../components/custom-buttom/custom-button';
import { AppState } from '../../store';
import { getTotalItems } from '../../modules/cart/selector';
import { addCartItem } from '../../modules/cart/actions';
import { CartItem } from '../../modules/cart/model';
import { CustomSpinner } from '../../components/custom-spinner/custom-spinner';
import { ReviewCard } from '../../components/reviews/review-card';
import { CustomModal } from '../../components/custom-modal/custom-modal';
import { Form } from 'react-bootstrap';
import { authToken } from '../../modules/authentication/selector';
import * as AuthenticationHelper from '../../modules/authentication/helpers';

import styles from './[productId].module.scss';

interface Props {
    query: {
        productId: string;
    };
    totalItems: number;
    authToken: string | null;
    onAddCartItem: (cartItem: CartItem) => void;
    count: () => void;
}

interface State {
    fetchStatus: FetchStatus;
    product: Model.Product | null;
    quantity: number;
    activeCarouselItem: number;
    showAddedToCartToast: boolean;
    showCreateReviewModal: boolean;
    submitReviewStatus: FetchStatus;
    submitReviewError: string | null;
    newReview: Model.CreateReviewBody;
}

class ProductDetails extends React.PureComponent<Props, State> {
    public state: State = {
        fetchStatus: FetchStatusEnum.initial,
        product: null,
        quantity: 1,
        activeCarouselItem: 0,
        showAddedToCartToast: false,
        showCreateReviewModal: false,
        submitReviewStatus: FetchStatusEnum.initial,
        submitReviewError: null,
        newReview: { rating: 0, title: '', description: '' }
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

    private handleOpenCreateReviewDialog = () => {
        if (AuthenticationHelper.isAuthenticated(this.props.authToken)) {
            this.setState({ showCreateReviewModal: true });
        } else {
            Router.push(`/login?redirectTo=/products/${this.props.query.productId}`);
        }
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
                    <Container>
                        <Row>
                            <Col sm={8} className={styles['product-view']}>
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
                            </Col>
                            <Col sm={4} className={styles['product-info']}>
                                <div className={styles.title}>{product.title}</div>
                                <div className={styles.rating}>{product.rating}/5 ({product.reviews.length} reviews)</div>
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
                            </Col>
                        </Row>
                        <Row className={styles['reviews-container']}>
                            <Col sm={6}>
                                <div className={styles['reviews-box']}>
                                    <div className={styles['top-bar']}>
                                        <h5>Reviews</h5>
                                        <CustomButton variant="secondary" onClick={this.handleOpenCreateReviewDialog}>
                                            Write a review
                                        </CustomButton>
                                    </div>
                                    {product.reviews.length > 0
                                        ? product.reviews.map((review) => {
                                            return <ReviewCard review={review} key={`review-${review.id}`} />;
                                        })
                                        : <div>This product has no reviews yet.</div>}
                                    {this.renderCreateReviewModal()}
                                </div>
                            </Col>
                        </Row>
                    </Container>
                </div>
            );
        }
    }

    private handleCloseCreateReviewModal = () => {
        this.setState({ showCreateReviewModal: false });
    };

    private handleInputChange = (field: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
        this.setState({ newReview: { ...this.state.newReview, [field]: event.target.value } } as Pick<State, any>);
    };

    private handleCreateReview = () => {
        this.setState({ submitReviewStatus: FetchStatusEnum.loading, submitReviewError: null }, async () => {
            try {
                const { query: { productId }, authToken } = this.props;
                const updatedProduct = await ProductApi.createReviewForProduct(productId, this.state.newReview, authToken!);
                console.log(updatedProduct);
                Router.reload();
            } catch (error: unknown) {
                const { message } = error as Error;
                this.setState({ submitReviewStatus: FetchStatusEnum.failure, submitReviewError: message });
            }
        });
    };

    private renderCreateReviewModal() {
        return (
            <CustomModal
                title="Write a review"
                show={this.state.showCreateReviewModal}
                onClose={this.handleCloseCreateReviewModal}
            >
                <Form>
                    <Form.Group controlId="formBasicRating">
                        {['1', '2', '3', '4', '5'].map((value) => {
                            return (
                                <Form.Check
                                    inline
                                    label={value}
                                    key={`rating-${value}`}
                                    name="rating"
                                    type="radio"
                                    value={value}
                                    onChange={this.handleInputChange('rating')}
                                />
                            );
                        })}
                    </Form.Group>
                    <Form.Group controlId="formBasicTitle">
                        <Form.Control
                            type="text"
                            placeholder="Title"
                            className={styles['text-input']}
                            onChange={this.handleInputChange('title')}
                        />
                    </Form.Group>
                    <Form.Group controlId="formBasicDescription">
                        <Form.Control
                            type="text"
                            className={classNames(styles['text-input'], styles['description-textarea'])}
                            onChange={this.handleInputChange('description')}
                            as="textarea"
                            placeholder="Leave a comment here"
                        />
                    </Form.Group>
                    <CustomButton variant="primary" className={styles['submit-button']} onClick={this.handleCreateReview}>Submit</CustomButton>
                </Form>
            </CustomModal>
        );
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
            const picturePath = generatePictureURL(product.pictures[0]?.filename);

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
                                <Image className={styles['product-picture']} src={picturePath} alt={product.title} />
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
            <Layout title={title} showNav showFooter>
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
    authToken: authToken(state.authentication),
    totalItems: getTotalItems(state.cart)
});

const mapDispatchToProps = (dispatch: Dispatch) => ({
    onAddCartItem: (cartItem: CartItem) => dispatch(addCartItem(cartItem))
});

export default connect(mapStateToProps, mapDispatchToProps)(ProductDetails);
