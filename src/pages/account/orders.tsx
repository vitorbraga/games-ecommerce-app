import React from 'react';
import { connect } from 'react-redux';
import Dinero from 'dinero.js';
import Spinner from 'react-bootstrap/Spinner';
import Alert from 'react-bootstrap/Alert';
import { BaseStructure } from '../../components/account/base-structure';
import { SideMenuItemEnum } from '../../components/account/side-menu';
import { Layout } from '../../components/layout';
import { getUser } from '../../modules/user/selector';
import { AppState } from '../../store';
import { FetchStatus, FetchStatusEnum } from '../../utils/api-helper';
import { withAuthenticationCheck } from '../../utils/authentication-wrapper';
import * as OrdersApi from '../../modules/orders/api';
import * as CommonHelpers from '../../utils/common-helper';
import { User } from '../../modules/user/model';
import { Order } from '../../modules/orders/model';

import styles from './orders.module.scss';

interface Props {
    authToken: string;
    user: User;
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
                const { user: { id: userId }, authToken } = this.props;

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
            return <div className={styles['loading-circle']}><Spinner animation="border" variant="info" /></div>;
        } else if (fetchStatus === FetchStatusEnum.failure) {
            return <Alert variant="danger">{fetchError}</Alert>;
        }

        return null;
    }

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
                    const allOrderItemsTotal = CommonHelpers.calculateAllOrderItemsTotal(order.orderItems);
                    const totalToPaid = Dinero({ amount: allOrderItemsTotal }).add(Dinero({ amount: shippingCosts })).getAmount();

                    return (
                        <div className={styles['order-box']} key={`order-box-${index}`}>
                            <h4>Order #{order.orderNumber}</h4>
                            <div className={styles['details-wrapper']}>
                                <div className={styles.column}>
                                    <div className={styles.label}>Order number</div>
                                    <div className={styles.value}>{order.orderNumber}</div>
                                    <div className={styles.label}>Ordered on</div>
                                    <div className={styles.value}>{order.createdAt}</div>
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
                                            <div>{CommonHelpers.formatPrice(allOrderItemsTotal)}</div>
                                        </div>
                                        <div className={styles.line}>
                                            <div>Shipping costs</div>
                                            <div>{CommonHelpers.formatPrice(shippingCosts)}</div>
                                        </div>
                                        <hr />
                                        <div className={styles.line}>
                                            <div>Total</div>
                                            <div>{CommonHelpers.formatPrice(totalToPaid)}</div>
                                        </div>
                                    </div>
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
    user: getUser(state.user)
});

export default connect(mapStateToProps)(withAuthenticationCheck(OrdersPage));
