import * as React from 'react';
import { connect } from 'react-redux';
import { Layout } from '../../components/layout';
import { withAuthenticationCheck } from '../../utils/authentication-wrapper';
import { getUserSession } from '../../modules/user/selector';
import { AppState } from '../../store';
import { UserSession } from '../../modules/user/model';
import { BaseStructure } from '../../components/account/base-structure';
import { SideMenuItemEnum } from '../../components/account/side-menu';

import styles from './index.module.scss';

interface Props {
    authToken: string | null;
    userSession: UserSession | null;
}

class AccountPage extends React.PureComponent<Props, never> {
    public render() {
        return (
            <Layout title="Account overview" showNav={true} customContentClass={styles['custom-layout-content']}>
                <BaseStructure activeMenuItem={SideMenuItemEnum.account}>
                    <h1>Account overview</h1>
                </BaseStructure>
            </Layout>
        );
    }
}

const mapStateToProps = (state: AppState) => ({
    userSession: getUserSession(state.user)
});

export default connect(mapStateToProps)(withAuthenticationCheck(AccountPage));
