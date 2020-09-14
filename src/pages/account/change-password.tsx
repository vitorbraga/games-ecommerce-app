import React from 'react';
import { BaseStructure } from '../../components/account/base-structure';
import { SideMenuItemEnum } from '../../components/account/side-menu';
import { Layout } from '../../components/layout';
import { withAuthenticationCheck } from '../../utils/authentication-wrapper';

import styles from './change-password.module.scss';

const ChangePasswordPage: React.FC<{}> = () => {
    return (
        <Layout title="Change password" showNav={true} customContentClass={styles['custom-layout-content']}>
            <BaseStructure activeMenuItem={SideMenuItemEnum.changePassword}>
                change pass
            </BaseStructure>
        </Layout>
    );
};

export default withAuthenticationCheck(ChangePasswordPage);
