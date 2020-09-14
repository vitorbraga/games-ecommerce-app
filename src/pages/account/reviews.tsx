import React from 'react';
import { BaseStructure } from '../../components/account/base-structure';
import { SideMenuItemEnum } from '../../components/account/side-menu';
import { Layout } from '../../components/layout';
import { withAuthenticationCheck } from '../../utils/authentication-wrapper';

import styles from './reviews.module.scss';

const ReviewsPage: React.FC<{}> = () => {
    return (
        <Layout title="My reviews" showNav={true} customContentClass={styles['custom-layout-content']}>
            <BaseStructure activeMenuItem={SideMenuItemEnum.reviews}>
                <h1>My reviews</h1>
            </BaseStructure>
        </Layout>
    );
};

export default withAuthenticationCheck(ReviewsPage);
