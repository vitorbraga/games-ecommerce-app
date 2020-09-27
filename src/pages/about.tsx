import React from 'react';
import { Layout } from '../components/layout/layout';

import styles from './about.module.scss';

const AboutPage: React.FC<{}> = () => {
    return (
        <Layout title="About" showNav showFooter>
            <div className={styles['about-container']}>
                <h3>About the project</h3>
                <div className={styles['about-box']}>
                    <div className={styles['left-wrapper']}>
                        left
                    </div>
                    <div className={styles['right-wrapper']}>
                        right
                    </div>
                </div>
                <h3 style={{ marginTop: '20px' }}>About the author</h3>
                <div className={styles['about-box']}>
                    <div className={styles['left-wrapper']}>
                        left
                    </div>
                    <div className={styles['right-wrapper']}>
                        right
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default AboutPage;
