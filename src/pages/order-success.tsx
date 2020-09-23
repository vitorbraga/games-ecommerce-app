import React from 'react';
import { Layout } from '../components/layout';

// import styles from './register-success.module.scss';

const OrderSuccessPage: React.FC<{}> = () => {
    return (
        <Layout title="Order success" showNav={false}>
            <div>
                <h1>Order success</h1>
            </div>
        </Layout>
    );
};

export default OrderSuccessPage;
