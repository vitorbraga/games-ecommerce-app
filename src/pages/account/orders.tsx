import React from 'react';
import { connect } from 'react-redux';
import Dinero from 'dinero.js';
import Alert from 'react-bootstrap/Alert';
import Image from 'react-bootstrap/Image';
import { BaseStructure } from '../../components/account/base-structure';
import { SideMenuItemEnum } from '../../components/account/side-menu';
import { Layout } from '../../components/layout';
import { getUserSession } from '../../modules/user/selector';
import { AppState } from '../../store';
import { FetchStatus, FetchStatusEnum, generatePictureURL } from '../../utils/api-helper';
import { withAuthenticationCheck } from '../../utils/authentication-wrapper';
import * as OrdersApi from '../../modules/orders/api';
import * as MoneyUtils from '../../utils/money-utils';
import { UserSession } from '../../modules/user/model';
import { Order, OrderStatus } from '../../modules/orders/model';
import * as DateUtils from '../../utils/date-utils';
import { OrderStatusBadge } from '../../widgets/order-status-badge/order-status-badge';

import styles from './orders.module.scss';
import { CustomSpinner } from '../../widgets/custom-spinner/custom-spinner';

interface Props {
    authToken: string;
    userSession: UserSession;
}

interface State {
    fetchStatus: FetchStatus;
    fetchError: string | null;
    orders: Order[];
}

class OrdersPage extends React.PureComponent<Props, State> {
    public state: State = {
        fetchStatus: FetchStatusEnum.initial,
        fetchError: null,
        orders: []
    };

    public componentDidMount() {
        this.setState({ fetchStatus: FetchStatusEnum.loading }, async () => {
            try {
                const { userSession: { id: userId }, authToken } = this.props;

                const orders = await OrdersApi.getUserOrders(userId, authToken);
                this.setState({ fetchStatus: FetchStatusEnum.success, orders });
            } catch (error) {
                this.setState({ fetchStatus: FetchStatusEnum.failure, fetchError: error.message });
            }
        });
    }

    private renderFetchStatus() {
        const { fetchStatus, fetchError } = this.state;

        if (fetchStatus === FetchStatusEnum.loading) {
            return <CustomSpinner />;
        } else if (fetchStatus === FetchStatusEnum.failure) {
            return <Alert variant="danger" style={{ marginTop: '12px' }}>{fetchError}</Alert>;
        }

        return null;
    }

    private openProductInANewTab(productId: string) {
        const productDetailsUrl = `/products/${productId}`;
        window.open(productDetailsUrl, '_blank');
    }

    private handleClickProduct = (productId: string) => () => {
        this.openProductInANewTab(productId);
    };

    private handleMouseDownProduct = (productId: string) => (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        if (event.button === 1) {
            this.openProductInANewTab(productId);
        }
    };

    private renderOrders() {
        const { orders } = this.state;

        if (orders.length === 0) {
            return <div>You didn't make any orders yet.</div>;
        }

        return (
            <div className={styles['orders-list']}>
                {orders.map((order, index) => {
                    const { deliveryAddress, shippingCosts } = order;
                    const totalItems = order.orderItems.reduce((prev, cur) => prev + cur.quantity, 0);
                    const allOrderItemsTotal = MoneyUtils.calculateAllOrderItemsTotal(order.orderItems);
                    const totalPaid = Dinero({ amount: allOrderItemsTotal }).add(Dinero({ amount: shippingCosts })).getAmount();

                    return (
                        <div className={styles['order-box']} key={`order-box-${index}`}>
                            <div className={styles['title-section']}>
                                <h5>#{order.orderNumber}</h5>
                                <h5><OrderStatusBadge orderStatus={order.status as OrderStatus} /></h5>
                            </div>
                            <div className={styles['details-section']}>
                                <div className={styles.column}>
                                    <div className={styles.label}>Order number</div>
                                    <div className={styles.value}>{order.orderNumber}</div>
                                    <div className={styles.label}>Ordered on</div>
                                    <div className={styles.value}>{DateUtils.formatDateFromMilliseconds(order.createdAt)}</div>
                                </div>
                                <div className={styles.column}>
                                    <div className={styles.label}>Delivery address</div>
                                    {/* TODO use <address> html tag */}
                                    <div className={styles.value}>
                                        <p>{deliveryAddress.fullName}</p>
                                        <p>{deliveryAddress.line1}</p>
                                        {deliveryAddress.line2 && <p>{deliveryAddress.line2}</p>}
                                        <p>{order.deliveryAddress.city}, {order.deliveryAddress.country.name}</p>
                                        <p>{order.deliveryAddress.zipCode}</p>
                                    </div>
                                </div>
                                <div className={styles.column}>
                                    <div className={styles.label}>Cost overview</div>
                                    <div className={styles['costs-wrapper']}>
                                        <div className={styles.line}>
                                            <div>Total items ({totalItems})</div>
                                            <div>{MoneyUtils.formatPrice(allOrderItemsTotal)}</div>
                                        </div>
                                        <div className={styles.line}>
                                            <div>Shipping costs</div>
                                            <div>{MoneyUtils.formatPrice(shippingCosts)}</div>
                                        </div>
                                        <hr />
                                        <div className={styles.line}>
                                            <div>Total</div>
                                            <div>{MoneyUtils.formatPrice(totalPaid)}</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className={styles['pictures-section']}>
                                <div className={styles['products-title']}>Products:</div>
                                <div className={styles['pictures-wrapper']}>
                                    {order.orderItems.map(({ product, quantity }, index) => {
                                        const imagePath = generatePictureURL(product.pictures[0].filename);
                                        return (
                                            <Image
                                                key={`product-picture-${index}`}
                                                src={imagePath}
                                                className={styles['product-preview']}
                                                title={`${product.title} (${quantity})`}
                                                onClick={this.handleClickProduct(product.id)}
                                                onMouseDown={this.handleMouseDownProduct(product.id)}
                                            />
                                        );
                                    })}
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        );
    }

    public render() {
        return (
            <Layout title="My orders" showNav={true} customContentClass={styles['custom-layout-content']}>
                <BaseStructure activeMenuItem={SideMenuItemEnum.orders}>
                    <div className={styles['orders-container']}>
                        <h4>My orders</h4>
                        {this.renderFetchStatus()}
                        {this.renderOrders()}
                    </div>
                </BaseStructure>
            </Layout>
        );
    }
};

const mapStateToProps = (state: AppState) => ({
    userSession: getUserSession(state.user)
});

export default connect(mapStateToProps)(withAuthenticationCheck(OrdersPage));
