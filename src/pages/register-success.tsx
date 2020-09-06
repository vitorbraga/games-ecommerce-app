import React from 'react';
import { Layout } from '../components/layout';

// import styles from './register-success.module.scss';

const RegisterPage: React.FunctionComponent = () => {
    return (
        <Layout title="Register" showNav={false}>
            <div>
                <h1>Register success</h1>
                <p>Will have an image, thanks for registering, link to login</p>
                <p>It can also have some message "check your email" to activate</p>
            </div>
        </Layout>
    );
};

export default RegisterPage;
