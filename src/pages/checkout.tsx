import React from 'react';
import { connect } from 'react-redux';
import classNames from 'classnames';
import Dinero from 'dinero.js';
import Alert from 'react-bootstrap/Alert';
import Spinner from 'react-bootstrap/Spinner';
import Accordion from 'react-bootstrap/Accordion';
import Card from 'react-bootstrap/Card';
import * as Yup from 'yup';
import { Formik, Field, Form, ErrorMessage } from 'formik';
import { Layout } from '../components/layout';
import { User } from '../modules/user/model';
import { FetchStatus, FetchStatusEnum } from '../utils/api-helper';
import { withAuthenticationCheck } from '../utils/authentication-wrapper';
import { CustomButton } from '../widgets/custom-buttom/custom-button';
import * as UserApi from '../modules/user/api';
import * as AddressApi from '../modules/address/api';
import { AppState } from '../store';
import { getUser } from '../modules/user/selector';
import { Address } from '../modules/address/model';
import { AddressCard } from '../widgets/address-card/address-card';
import { CustomModal } from '../widgets/custom-modal/custom-modal';
import { getCartItems, getTotalItems } from '../modules/cart/selector';
import { CartItem } from '../modules/cart/model';
import * as CommonHelpers from '../utils/common-helper';
import { MaskedField } from '../widgets/masked-field/masked-field';
import * as CustomValidators from '../utils/validators';

import styles from './checkout.module.scss';

interface Props {
    authToken: string;
    user: User; // TODO it will be only userId from localstorage
    cartItems: CartItem[];
    totalItems: number;
}

interface State {
    fetchStatus: FetchStatus;
    fetchAddressesStatus: FetchStatus;
    userFullData: User | null;
    selectedAddress: Address | null;
    addressModalOpen: boolean;
    allAddresses: Address[];
    shippingCosts: number;
}

interface FormData {
    name: string;
    cardNumber: string;
    expirationDate: string;
    securityCode: string;
}

class CheckoutPage extends React.PureComponent<Props, State> {
    public state: State = {
        fetchStatus: FetchStatusEnum.initial,
        fetchAddressesStatus: FetchStatusEnum.initial,
        userFullData: null,
        selectedAddress: null,
        addressModalOpen: false,
        allAddresses: [],
        shippingCosts: 0
    };

    private formInitialValues: FormData = {
        name: '',
        cardNumber: '',
        expirationDate: '',
        securityCode: ''
    };

    private validationSchema = Yup.object().shape({
        name: Yup.string().required('Full name is required'),
        cardNumber: Yup.string()
            .required('Card is required')
            .test('test-credit-card-number', 'Invalid credit card number', CustomValidators.validateCreditCardNumber),
        expirationDate: Yup.string()
            .required('Expiration date is required')
            .test('test-credit-card-expiration-date', 'Invalid Expiration Date has past', CustomValidators.validateCreditCartExpirationDate)
            .test('test-credit-card-expiration-month', 'Invalid Expiration Month', CustomValidators.validateCreditCartExpirationMonth),
        securityCode: Yup.string().required('Security code is required')
    });

    public componentDidMount() {
        this.setState({ fetchStatus: FetchStatusEnum.loading }, async () => {
            try {
                const { user: { id: userId }, authToken } = this.props;

                const userFullData = await UserApi.getUserFullData(userId, authToken);
                this.setState({ fetchStatus: FetchStatusEnum.success, userFullData, selectedAddress: userFullData.mainAddress || null });
            } catch (error) {
                this.setState({ fetchStatus: FetchStatusEnum.failure });
            }
        });
    }

    private renderFetchStatus() {
        const { fetchStatus } = this.state;

        if (fetchStatus === FetchStatusEnum.loading) {
            return <div className={styles['loading-circle']}><Spinner animation="border" variant="info" /></div>;
        } else if (fetchStatus === FetchStatusEnum.failure) {
            return <Alert variant="danger">Failed fetching user data.</Alert>;
        }

        return null;
    }

    private renderFetchingAddressesStatus() {
        const { fetchStatus } = this.state;

        if (fetchStatus === FetchStatusEnum.loading) {
            return <div className={styles['loading-circle']}><Spinner animation="border" variant="info" /></div>;
        } else if (fetchStatus === FetchStatusEnum.failure) {
            return <Alert variant="danger">Failed fetching user addresses.</Alert>;
        }

        return null;
    }

    private handleCloseAddressModal = () => {
        this.setState({ addressModalOpen: false });
    };

    private handleSelectAddress = (address: Address) => () => {
        this.setState({ selectedAddress: address });
    };

    private renderAddressModal() {
        const { allAddresses, selectedAddress } = this.state;
        return (
            <CustomModal
                title="My addresses"
                show={this.state.addressModalOpen}
                onClose={this.handleCloseAddressModal}
            >
                <div>
                    {allAddresses.map((address, index) => {
                        const isSelected = address.id === selectedAddress?.id;
                        const footer = isSelected
                            ? <div>This is the selected address</div>
                            : <div><a className={styles.link} onClick={this.handleSelectAddress(address)}>Use this address</a></div>;

                        return (
                            <AddressCard
                                address={address}
                                isSelected={isSelected}
                                fullWidth
                                key={`address-${index}`}
                                footer={footer}
                            />
                        );
                    })}
                </div>
            </CustomModal>
        );
    }

    private handleOpenAddressModal = async () => {
        this.setState({ fetchAddressesStatus: FetchStatusEnum.loading }, async () => {
            try {
                const { user: { id: userId }, authToken } = this.props;
                const allAddresses = await AddressApi.getUserAddresses(userId, authToken);
                this.setState({ addressModalOpen: true, allAddresses });
            } catch (error) {
                this.setState({ fetchAddressesStatus: FetchStatusEnum.failure });
            }
        });
    };

    private renderDeliveryAddress() {
        const { selectedAddress } = this.state;
        if (selectedAddress === null) {
            return <div>You don't have a registered address. You can register addresses at <a href="/account/addresses" className={styles.link}>My addresses</a>.</div>;
        }

        return (
            <div>
                <AddressCard address={selectedAddress} fullWidth />
                <CustomButton variant="secondary" onClick={this.handleOpenAddressModal}>
                    Choose different address
                </CustomButton>
            </div>
        );
    }

    private renderOverview() {
        const { cartItems, totalItems } = this.props;
        const { shippingCosts } = this.state;

        const allCartItemsTotal = CommonHelpers.calculateAllCartItemsTotal(cartItems);
        const totalToBePaid = Dinero({ amount: allCartItemsTotal }).add(Dinero({ amount: shippingCosts })).getAmount();

        return (
            <div className={styles.overview}>
                <Accordion>
                    <Card className={styles['accordion-card']}>
                        <Accordion.Toggle as={Card.Header} eventKey="0" className={styles['products-card-header']}>
                            <div className={styles['products-card-header-wrapper']}>
                                <div>Products ({totalItems})</div>
                                <div>{CommonHelpers.formatPrice(allCartItemsTotal)}</div>
                            </div>
                        </Accordion.Toggle>
                        <Accordion.Collapse eventKey="0">
                            <Card.Body className={styles['products-card-body']}>
                                <div>
                                    {cartItems.map((cartItem, index) => {
                                        const cartItemTotal = CommonHelpers.calculateCartItemTotal(cartItem);

                                        return (
                                            <div className={styles['cart-item-wrapper']} key={`cart-item-${index}`}>
                                                <div>{cartItem.product.title} <span className={styles['item-quantity']}>({cartItem.quantity})</span></div>
                                                <div>{CommonHelpers.formatPrice(cartItemTotal)}</div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </Card.Body>
                        </Accordion.Collapse>
                    </Card>
                </Accordion>
                <div className={styles['shipping-costs-wrapper']}>
                    <div>Shipping costs</div>
                    <div>{shippingCosts === 0 ? <span className={styles.free}>Free</span> : CommonHelpers.formatPrice(shippingCosts)}</div>
                </div>
                <div className={styles['to-be-paid-wrapper']}>
                    <div>To be paid</div>
                    <div>{CommonHelpers.formatPrice(totalToBePaid)}</div>
                </div>
            </div>
        );
    }

    private renderPaymentInfo() {
        return (
            <Formik
                initialValues={this.formInitialValues}
                validationSchema={this.validationSchema}
                onSubmit={() => undefined}
            >
                {({ errors, touched }) => {
                    return (
                        <Form>
                            <div className="form-group">
                                <label htmlFor="name">Name on card *</label>
                                <Field
                                    name="name"
                                    placeholder="John Doe"
                                    type="text"
                                    className={classNames('form-control', styles['text-input'], { 'is-invalid': errors.name && touched.name })}
                                />
                                <ErrorMessage name="name" component="div" className="invalid-feedback" />
                            </div>
                            <div className="form-group">
                                <label htmlFor="cardNumber">Credit card number *</label>
                                <MaskedField
                                    name="cardNumber"
                                    placeholder="9999 9999 9999 9999"
                                    mask={CustomValidators.CREDIT_CARD_MASK}
                                    className={classNames('form-control', styles['text-input'], { 'is-invalid': errors.cardNumber && touched.cardNumber })}
                                />
                                <ErrorMessage name="cardNumber" component="div" className="invalid-feedback" />
                            </div>
                            <div className={styles['double-fields-wrapper']}>
                                <div className={classNames('form-group', styles['small-field'])}>
                                    <label htmlFor="expirationDate">Expiration date *</label>
                                    <MaskedField
                                        name="expirationDate"
                                        placeholder="10/2025"
                                        mask={CustomValidators.EXPIRATION_DATE_MASK}
                                        className={classNames('form-control', styles['text-input'], { 'is-invalid': errors.expirationDate && touched.expirationDate })}
                                    />
                                    <ErrorMessage name="expirationDate" component="div" className="invalid-feedback" />
                                </div>
                                <div className={classNames('form-group', styles['small-field'])}>
                                    <label htmlFor="securityCode">Security code *</label>
                                    <Field
                                        name="securityCode"
                                        placeholder="CVC"
                                        type="text"
                                        className={classNames('form-control', styles['text-input'], { 'is-invalid': errors.securityCode && touched.securityCode })}
                                    />
                                    <ErrorMessage name="securityCode" component="div" className="invalid-feedback" />
                                </div>
                            </div>
                        </Form>
                    );
                }}
            </Formik>
        );
    }

    private handleClickCompleteOrder = () => {
        console.log('create order');
    };

    public render() {
        return (
            <Layout title="Checkout" showNav={true}>
                <div className={styles['checkout-container']}>
                    <div className={styles['left-box']}>
                        {this.renderFetchStatus()}
                        {this.renderFetchingAddressesStatus()}
                        <div className={styles['delivery-address-box']}>
                            <h4>Delivery address</h4>
                            {this.renderDeliveryAddress()}
                            {this.renderAddressModal()}
                        </div>
                        <div className={styles['payment-box']}>
                            <h4>Payment info</h4>
                            {this.renderPaymentInfo()}
                        </div>
                        <div className={styles['complete-box']}>
                            <CustomButton variant="primary" onClick={this.handleClickCompleteOrder}>Complete order</CustomButton>
                        </div>
                    </div>
                    <div className={styles['right-box']}>
                        <h4>Overview</h4>
                        {this.renderOverview()}
                    </div>
                </div>
            </Layout>
        );
    }
};

const mapStateToProps = (state: AppState) => ({
    user: getUser(state.user),
    cartItems: getCartItems(state.cart),
    totalItems: getTotalItems(state.cart)
});

export default connect(mapStateToProps)(withAuthenticationCheck(CheckoutPage));
