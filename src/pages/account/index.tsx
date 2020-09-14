import * as React from 'react';
import { connect } from 'react-redux';
import { Layout } from '../../components/layout';
import { withAuthenticationCheck } from '../../utils/authentication-wrapper';
import { getUser } from '../../modules/user/selector';
import { AppState } from '../../store';
import { User } from '../../modules/user/model';
import { BaseStructure } from '../../components/account/base-structure';
import { SideMenuItemEnum } from '../../components/account/side-menu';

import styles from './index.module.scss';

interface Props {
    authToken: string | null;
    user: User | null;
}

class AccountPage extends React.PureComponent<Props, never> {
    public render() {
        return (
            <Layout title="Login" showNav={true} customContentClass={styles['custom-layout-content']}>
                <BaseStructure activeMenuItem={SideMenuItemEnum.account}>
                    <h1>Account overview</h1>
                </BaseStructure>
            </Layout>
        );
    }
}

const mapStateToProps = (state: AppState) => ({
    user: getUser(state.user)
});

export default connect(mapStateToProps)(withAuthenticationCheck(AccountPage));
