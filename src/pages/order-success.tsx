import { ParsedUrlQuery } from 'querystring';
import React from 'react';
import Image from 'react-bootstrap/Image';
import { CustomSpinner } from '../components/custom-spinner/custom-spinner';
import { Layout } from '../components/layout/layout';
import { CustomStatusBox } from '../components/custom-status-box/custom-status-box';
import * as OrderApi from '../modules/orders/api';
import { Order } from '../modules/orders/model';
import { FetchState, FetchStatusEnum } from '../utils/api-helper';

import styles from './order-success.module.scss';

interface Props {
    query: ParsedUrlQuery;
}

function OrderSuccessPage({ query: { order: orderId } }: Props) {
    const [fetchState, setFetchState] = React.useState<FetchState<Order | null>>({ status: FetchStatusEnum.initial, fetchError: null, data: null });

    React.useEffect(() => {
        const fetchOrderById = async () => {
            try {
                setFetchState({ status: FetchStatusEnum.loading, fetchError: null, data: null });
                if (orderId && typeof orderId === 'string') {
                    const fetchedOrder = await OrderApi.getOrder(orderId);
                    setFetchState({ status: FetchStatusEnum.success, fetchError: null, data: fetchedOrder });
                }
            } catch (error) {
                setFetchState({ status: FetchStatusEnum.failure, fetchError: error.message, data: null });
            }
        };

        fetchOrderById();
    }, []);

    const { data: order } = fetchState;
    return (
        <Layout title="Order success" showNav>
            <div className={styles['order-success-container']}>
                <h2 className={styles['page-title']}>Order success</h2>
                <h5 className={styles['page-subtitle']}>Thanks for your order. We will start working for you immediately.</h5>
                {fetchState.status === FetchStatusEnum.loading && <CustomSpinner />}
                {fetchState.status === FetchStatusEnum.failure && <CustomStatusBox type="danger">{fetchState.fetchError}</CustomStatusBox>}
                {order
                    && <div className={styles['order-information-wrapper']}>
                        <div className={styles['info-card']}>
                            <Image src="/calendar_today.svg" className={styles.icon} />
                            <div className={styles.text}>
                                <p>We expect to deliver...</p>
                                <p>Actually, this order won't be delivered. It is a fake order. Every data in this website is fake ;)</p>
                            </div>
                        </div>
                        <div className={styles['info-card']}>
                            <Image src="/house.svg" className={styles.icon} />
                            <div className={styles.text}>
                                <p>The delivery address would be:</p>
                                <p>{order.deliveryAddress.line1}</p>
                                {order.deliveryAddress.line2 && <p>{order.deliveryAddress.line2}</p>}
                                <p>{order.deliveryAddress.city}, {order.deliveryAddress.country.name}</p>
                                <p>{order.deliveryAddress.zipCode}</p>
                            </div>
                        </div>
                        <div className={styles['info-card']}>
                            <Image src="/email.svg" className={styles.icon} />
                            <div className={styles.text}>We will send an email confirmation to <b>{order.user.email}.</b></div>
                        </div>
                        <div className={styles['info-card']}>
                            <Image src="/help.svg" className={styles.icon} />
                            <div className={styles.text}>
                                <p>Do you have questions?</p>
                                <p>Go to our <a className={styles.link} href="/faq">FAQ</a> and check the responses for the most common questions.</p>
                            </div>
                        </div>
                    </div>
                }
            </div>
        </Layout>
    );
};

OrderSuccessPage.getInitialProps = ({ query }: any) => {
    return { query };
};

export default OrderSuccessPage;
