import React from 'react';
import { Layout } from '../components/layout';

// import styles from './checkout.module.scss';

const CheckoutPage: React.FC<{}> = () => {
    return (
        <Layout title="Checkout" showNav={false}>
            <div>
                <h1>Checkout page</h1>
            </div>
        </Layout>
    );
};

export default CheckoutPage;
