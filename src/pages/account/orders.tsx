import React from 'react';
import { BaseStructure } from '../../components/account/base-structure';
import { SideMenuItemEnum } from '../../components/account/side-menu';
import { Layout } from '../../components/layout';
import { withAuthenticationCheck } from '../../utils/authentication-wrapper';

import styles from './orders.module.scss';

const OrdersPage: React.FC<{}> = () => {
    return (
        <Layout title="My orders" showNav={true} customContentClass={styles['custom-layout-content']}>
            <BaseStructure activeMenuItem={SideMenuItemEnum.orders}>
                orders
            </BaseStructure>
        </Layout>
    );
};

export default withAuthenticationCheck(OrdersPage);
