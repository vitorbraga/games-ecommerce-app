import React from 'react';
import Router from 'next/router';
import { CustomButton } from '../components/custom-buttom/custom-button';
import { Layout } from '../components/layout/layout';
import Image from 'react-bootstrap/Image';

import styles from './register-success.module.scss';

const RegisterPage: React.FC<{}> = () => {
    const handleClickLogin = () => {
        Router.push('/login');
    };

    return (
        <Layout title="Registration success" showNav showFooter customContentClass={styles['custom-content']}>
            <div className={styles['registration-success-container']}>
                <Image src="/success.svg" className={styles.image} />
                <h4 className={styles.title}>Registration success</h4>
                <p>Congratulations! You can know take advantage of this incredible ecommerce!</p>
                <p>Eventually we will send you an email for account confirmation, but this feature is not implemented yet. 😉</p>
                <CustomButton variant="primary" onClick={handleClickLogin} className={styles['login-button']}>Login</CustomButton>
            </div>
        </Layout>
    );
};

export default RegisterPage;
