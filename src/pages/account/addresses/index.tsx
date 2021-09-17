import React from 'react';
import Router from 'next/router';
import { connect } from 'react-redux';
import Card from 'react-bootstrap/Card';
import { BaseStructure } from '../../../components/account/base-structure';
import { SideMenuItemEnum } from '../../../components/account/side-menu';
import { Layout } from '../../../components/layout/layout';
import * as AddressApi from '../../../modules/address/api';
import * as UserApi from '../../../modules/user/api';
import { Address } from '../../../modules/address/model';
import { User, UserSession } from '../../../modules/user/model';
import { getUserSession } from '../../../modules/user/selector';
import { AppState } from '../../../store';
import { FetchStatus, FetchStatusEnum } from '../../../utils/api-helper';
import { withAuthenticationCheck } from '../../../utils/authentication-wrapper';
import { CustomButton } from '../../../components/custom-buttom/custom-button';
import { AddressCard } from '../../../components/address-card/address-card';
import { CustomSpinner } from '../../../components/custom-spinner/custom-spinner';
import { CustomStatusBox } from '../../../components/custom-status-box/custom-status-box';

import styles from './index.module.scss';

interface Props {
    authToken: string;
    userSession: UserSession;
}

interface State {
    fetchStatus: FetchStatus;
    fetchError: string | null;
    addresses: Address[];
    userFullData: User | null;
}

class AddressesPage extends React.PureComponent<Props, State> {
    public state: State = {
        fetchStatus: FetchStatusEnum.initial,
        fetchError: null,
        addresses: [],
        userFullData: null
    };

    public componentDidMount() {
        this.setState({ fetchStatus: FetchStatusEnum.loading }, async () => {
            try {
                const { userSession: { id: userId }, authToken } = this.props;

                const userFullData = await UserApi.getUserFullData(userId, authToken);
                const addresses = await AddressApi.getUserAddresses(userId, authToken);
                this.setState({ fetchStatus: FetchStatusEnum.success, userFullData, addresses });
            } catch (error) {
                this.setState({ fetchStatus: FetchStatusEnum.failure });
            }
        });
    }

    private handleClickRemoveAddress = (addressId: string) => () => {
        this.setState({ fetchStatus: FetchStatusEnum.loading }, async () => {
            try {
                await AddressApi.removeAddress(this.props.userSession.id, addressId, this.props.authToken);
                Router.reload();
            } catch (error: unknown) {
                const { message } = error as Error;
                this.setState({ fetchStatus: FetchStatusEnum.failure, fetchError: message });
            }
        });
    };

    private handleClickSetMainAddress = (addressId: string) => () => {
        this.setState({ fetchStatus: FetchStatusEnum.loading }, async () => {
            try {
                await AddressApi.setMainAddress(this.props.userSession.id, addressId, this.props.authToken);
                Router.reload();
            } catch (error: unknown) {
                const { message } = error as Error;
                this.setState({ fetchStatus: FetchStatusEnum.failure, fetchError: message });
            }
        });
    };

    private renderUserAddresses() {
        const { addresses, userFullData } = this.state;

        if (addresses.length === 0) {
            return <div className={styles['empty-state']}>You don't have registered addresses. Click here to add one.</div>;
        }

        return (
            <div className={styles['current-addresses-wrapper']}>
                {addresses.map((address, index) => {
                    const isMainAddress = address.id === userFullData?.mainAddress?.id;
                    const footer = (
                        <div className={styles['card-actions']}>
                            {isMainAddress
                                ? <div className={styles['main-address']}>Main address</div>
                                : <Card.Link className={styles.link} onClick={this.handleClickSetMainAddress(address.id)}>Set as main address</Card.Link>
                            }
                            <Card.Link className={styles.link} onClick={this.handleClickRemoveAddress(address.id)}>Remove</Card.Link>
                        </div>);

                    return (
                        <AddressCard
                            address={address}
                            key={`address-${index}`}
                            isSelected={isMainAddress}
                            footer={footer}
                            customClass={styles['custom-address-card']}
                        />
                    );
                })}
            </div>
        );
    }

    private renderFetchStatus() {
        const { fetchStatus, fetchError } = this.state;

        if (fetchStatus === FetchStatusEnum.loading) {
            return <CustomSpinner />;
        } else if (fetchStatus === FetchStatusEnum.failure) {
            return <CustomStatusBox type="danger" style={{ marginTop: '12px' }}>{fetchError}</CustomStatusBox>;
        }

        return null;
    }

    private handleClickAddNewAddress = () => {
        Router.push('/account/addresses/new');
    };

    public render() {
        return (
            <Layout title="My addresses" showNav>
                <BaseStructure activeMenuItem={SideMenuItemEnum.addresses}>
                    <div className={styles['addresses-container']}>
                        <div>
                            <h3>My addresses</h3>
                            {this.renderFetchStatus()}
                            {this.renderUserAddresses()}
                        </div>
                        <div>
                            <CustomButton variant="primary" onClick={this.handleClickAddNewAddress}>Add new address</CustomButton>
                        </div>
                    </div>
                </BaseStructure>
            </Layout>
        );
    }
};

const mapStateToProps = (state: AppState) => ({
    userSession: getUserSession(state.user)
});

export default connect(mapStateToProps)(withAuthenticationCheck(AddressesPage));
