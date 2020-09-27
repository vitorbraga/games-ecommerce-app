import React from 'react';
import { Layout } from '../components/layout/layout';

import styles from './terms-and-conditions.module.scss';

const TermsAndConditionsPage: React.FC<{}> = () => {
    return (
        <Layout title="About" showNav showFooter>
            <div className={styles['about-container']}>
                <h3>Terms and Conditions</h3>
            </div>
        </Layout>
    );
};

export default TermsAndConditionsPage;
