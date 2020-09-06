import React from 'react';
import { Layout } from '../components/layout';
import { LoginContainer } from '../container/LoginContainer';

import styles from './login.module.scss';

const Login: React.FunctionComponent = () => {
    return (
        <Layout title="Login" showNav={false} customContentClass={styles['custom-content']}>
            <LoginContainer />
        </Layout>
    );
};

export default Login;
