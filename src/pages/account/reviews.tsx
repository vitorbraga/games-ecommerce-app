import React from 'react';
import { BaseStructure } from '../../components/account/base-structure';
import { SideMenuItemEnum } from '../../components/account/side-menu';
import { Layout } from '../../components/layout/layout';
import { withAuthenticationCheck } from '../../utils/authentication-wrapper';

import styles from './reviews.module.scss';

const ReviewsPage: React.FC<{}> = () => {
    return (
        <Layout title="My reviews" showNav>
            <BaseStructure activeMenuItem={SideMenuItemEnum.reviews}>
                <div className={styles['reviews-container']}>
                    <h3 className={styles.title}>My reviews</h3>
                    <div>Not implemented yet :(</div>
                </div>
            </BaseStructure>
        </Layout>
    );
};

export default withAuthenticationCheck(ReviewsPage);
