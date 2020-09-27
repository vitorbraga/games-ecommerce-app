import React from 'react';
import { BaseStructure } from '../../components/account/base-structure';
import { SideMenuItemEnum } from '../../components/account/side-menu';
import { Layout } from '../../components/layout/layout';
import { withAuthenticationCheck } from '../../utils/authentication-wrapper';

import styles from './reviews.module.scss';

const ReviewsPage: React.FC<{}> = () => {
    return (
        <Layout title="My reviews" showNav={true} customContentClass={styles['custom-layout-content']}>
            <BaseStructure activeMenuItem={SideMenuItemEnum.reviews}>
                <h3>My reviews</h3>
            </BaseStructure>
        </Layout>
    );
};

export default withAuthenticationCheck(ReviewsPage);
