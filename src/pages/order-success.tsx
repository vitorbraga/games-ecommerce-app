import { ParsedUrlQuery } from 'querystring';
import React from 'react';
import Alert from 'react-bootstrap/Alert';
import Image from 'react-bootstrap/Image';
import Spinner from 'react-bootstrap/Spinner';
import { Layout } from '../components/layout';
import * as OrderApi from '../modules/orders/api';
import { Order } from '../modules/orders/model';

import styles from './order-success.module.scss';

interface Props {
    query: ParsedUrlQuery;
}

function OrderSuccessPage({ query: { order: orderId } }: Props) {
    const [order, setOrder] = React.useState<Order | null>(null);
    const [loading, setLoading] = React.useState<boolean>(false);
    const [error, setError] = React.useState<string | null>(null);

    React.useEffect(() => {
        const fetchOrderById = async () => {
            try {
                setLoading(true);
                if (orderId && typeof orderId === 'string') {
                    const fetchedOrder = await OrderApi.getOrder(orderId);
                    setLoading(false);
                    setOrder(fetchedOrder);
                }
            } catch (error) {
                setError(error.message);
            }
        };

        fetchOrderById();
    }, []);

    return (
        <Layout title="Order success" showNav={true}>
            <div className={styles['order-success-container']}>
                <h2 className={styles['page-title']}>Order success</h2>
                <h5 className={styles['page-subtitle']}>Thanks for your order. We will start working for you immediately.</h5>
                {loading && <div className={styles['loading-circle']}><Spinner animation="border" variant="info" /></div>}
                {error && <Alert variant="danger" className={styles['error-box']}>{error}</Alert>}
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
