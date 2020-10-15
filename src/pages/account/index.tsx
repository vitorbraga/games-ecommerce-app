import * as React from 'react';
import { connect } from 'react-redux';
import Dinero from 'dinero.js';
import Image from 'react-bootstrap/Image';
import { Layout } from '../../components/layout/layout';
import { withAuthenticationCheck } from '../../utils/authentication-wrapper';
import { getUserSession } from '../../modules/user/selector';
import { AppState } from '../../store';
import { User, UserSession } from '../../modules/user/model';
import { BaseStructure } from '../../components/account/base-structure';
import { SideMenuItemEnum } from '../../components/account/side-menu';
import * as UserApi from '../../modules/user/api';
import { FetchStatus, FetchStatusEnum, generatePictureURL } from '../../utils/api-helper';
import { CustomSpinner } from '../../components/custom-spinner/custom-spinner';
import { AddressCard } from '../../components/address-card/address-card';
import * as MoneyUtils from '../../utils/money-utils';
import * as DateUtils from '../../utils/date-utils';
import { Order, OrderStatus } from '../../modules/orders/model';
import { OrderStatusBadge } from '../../components/order-status-badge/order-status-badge';
import { CustomStatusBox } from '../../components/custom-status-box/custom-status-box';

import styles from './index.module.scss';

interface Props {
    authToken: string;
    userSession: UserSession;
}

interface State {
    fetchStatus: FetchStatus;
    fetchError: string | null;
    userFullData: User | null;
}

class AccountPage extends React.PureComponent<Props, State> {
    public state: State = {
        fetchStatus: FetchStatusEnum.initial,
        fetchError: null,
        userFullData: null
    };

    public componentDidMount() {
        this.setState({ fetchStatus: FetchStatusEnum.loading }, async () => {
            try {
                const { userSession: { id: userId }, authToken } = this.props;

                const userFullData = await UserApi.getUserFullData(userId, authToken);
                this.setState({ fetchStatus: FetchStatusEnum.success, userFullData });
            } catch (error) {
                this.setState({ fetchStatus: FetchStatusEnum.failure, fetchError: error.message });
            }
        });
    }

    private sortOrdersDescComparator(orderA: Order, orderB: Order) {
        return orderA.createdAt > orderB.createdAt ? -1 : 1;
    }

    private renderOrders({ orders }: User) {
        if (orders && orders.length > 0) {
            const sortedOrders = orders.sort(this.sortOrdersDescComparator).slice(0, 5);
            return (
                <>
                    <div className={styles['orders-wrapper']}>
                        {sortedOrders.slice(0, 3).map((order, orderIndex) => {
                            const totalItems = order.orderItems.reduce((prev, cur) => prev + cur.quantity, 0);
                            const allOrderItemsTotal = MoneyUtils.calculateAllItemsTotal(order.orderItems);
                            const totalPaid = Dinero({ amount: allOrderItemsTotal }).add(Dinero({ amount: order.shippingCosts })).getAmount();

                            return (
                                <div className={styles['order-item']} key={`order-${orderIndex}`}>
                                    <div className={styles.line}>
                                        <div><b>#{order.orderNumber}</b></div>
                                        <div style={{ fontSize: '14px' }}><OrderStatusBadge orderStatus={order.status as OrderStatus} /></div>
                                    </div>
                                    <div className={styles.line}>
                                        <div>{totalItems} item(s)</div>
                                        <div>{MoneyUtils.formatPrice(totalPaid)}</div>
                                    </div>
                                    <div className={styles.line}>
                                        <div>Ordered on</div>
                                        <div>{DateUtils.formatDateFromMilliseconds(order.createdAt, 'L')}</div>
                                    </div>
                                    <div className={styles['pictures-wrapper']}>
                                        {order.orderItems.slice(0, 5).map((orderItem, orderItemIndex) => {
                                            const imagePath = generatePictureURL(orderItem.product.pictures[0].filename);
                                            return (
                                                <Image
                                                    src={imagePath}
                                                    key={`picture-${orderIndex}-${orderItemIndex}`}
                                                    className={styles['picture-thumb']}
                                                />
                                            );
                                        })}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </>
            );
        }

        return <div className={styles['section-wrapper']}>You haven't made any orders yet.</div>;
    }

    public render() {
        const { userFullData, fetchError, fetchStatus } = this.state;

        return (
            <Layout title="Account overview" showNav>
                <BaseStructure activeMenuItem={SideMenuItemEnum.account}>
                    <div className={styles['overview-container']}>
                        <h3 className={styles.title}>Account overview</h3>
                        {fetchStatus === FetchStatusEnum.loading && <CustomSpinner />}
                        {fetchError && <CustomStatusBox type="danger">{fetchError}</CustomStatusBox>}
                        {userFullData
                            && <>
                                <div className={styles['section-wrapper']}>
                                    <h5>Orders</h5>
                                    {this.renderOrders(userFullData)}
                                </div>
                                <div className={styles['section-wrapper']}>
                                    <h5>Reviews</h5>
                                    <div className={styles['empty-text']}>You haven't made any reviews yet.</div>
                                </div>
                                <div className={styles['section-wrapper']}>
                                    <h5>Personal information</h5>
                                    <div className={styles['info-wrapper']}>
                                        <div className={styles.profile}>
                                            <div className={styles.line}>
                                                <div>Full name</div>
                                                <div><strong>{userFullData.firstName} {userFullData.lastName}</strong></div>
                                            </div>
                                            <div className={styles.line}>
                                                <div>Email</div>
                                                <div><strong>{userFullData.email}</strong></div>
                                            </div>
                                            <div className={styles.line}>
                                                <div>Registered on</div>
                                                <div><strong>{DateUtils.formatDateFromMilliseconds(userFullData.createdAt)}</strong></div>
                                            </div>
                                        </div>
                                    </div>
                                    <h5 style={{ marginTop: '20px' }}>Main address</h5>
                                    {userFullData.mainAddress
                                        ? <AddressCard address={userFullData.mainAddress} isSelected={true} customClass={styles['custom-address-card']} />
                                        : <div className={styles['empty-text']}>You haven't registered a main address yet.</div>
                                    }
                                </div>
                            </>
                        }

                    </div>
                </BaseStructure>
            </Layout>
        );
    }
}

const mapStateToProps = (state: AppState) => ({
    userSession: getUserSession(state.user)
});

export default connect(mapStateToProps)(withAuthenticationCheck(AccountPage, '/account'));
