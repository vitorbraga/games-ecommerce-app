import React from 'react';
import { Layout } from '../components/layout';
import { Register } from '../components/register';

import styles from './register.module.scss';

const RegisterPage: React.FunctionComponent = () => {
    return (
        <Layout title="Register" showNav={false} customContentClass={styles['custom-content']}>
            <Register />
        </Layout>
    );
};

export default RegisterPage;
