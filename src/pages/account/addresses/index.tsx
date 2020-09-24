import React from 'react';
import Router from 'next/router';
import { connect } from 'react-redux';
import Card from 'react-bootstrap/Card';
import Spinner from 'react-bootstrap/Spinner';
import Alert from 'react-bootstrap/Alert';
import { BaseStructure } from '../../../components/account/base-structure';
import { SideMenuItemEnum } from '../../../components/account/side-menu';
import { Layout } from '../../../components/layout';
import * as AddressApi from '../../../modules/address/api';
import * as UserApi from '../../../modules/user/api';
import { Address } from '../../../modules/address/model';
import { User } from '../../../modules/user/model';
import { getUser } from '../../../modules/user/selector';
import { AppState } from '../../../store';
import { FetchStatus, FetchStatusEnum } from '../../../utils/api-helper';
import { withAuthenticationCheck } from '../../../utils/authentication-wrapper';
import { CustomButton } from '../../../widgets/custom-buttom/custom-button';

import styles from './index.module.scss';
import { AddressCard } from '../../../widgets/address-card/address-card';

interface Props {
    authToken: string;
    user: User;
}

interface State {
    fetchStatus: FetchStatus;
    addresses: Address[];
    removeStatus: FetchStatus;
    setMainAddressStatus: FetchStatus;
    userFullData: User | null;
}

class AddressesPage extends React.PureComponent<Props, State> {
    public state: State = {
        fetchStatus: FetchStatusEnum.initial,
        addresses: [],
        removeStatus: FetchStatusEnum.initial,
        setMainAddressStatus: FetchStatusEnum.initial,
        userFullData: null
    };

    public componentDidMount() {
        this.setState({ fetchStatus: FetchStatusEnum.loading }, async () => {
            try {
                const { user: { id: userId }, authToken } = this.props;

                const userFullData = await UserApi.getUserFullData(userId, authToken);
                const addresses = await AddressApi.getUserAddresses(userId, authToken);
                this.setState({ fetchStatus: FetchStatusEnum.success, userFullData, addresses });
            } catch (error) {
                this.setState({ fetchStatus: FetchStatusEnum.failure });
            }
        });
    }

    private handleClickRemoveAddress = (addressId: string) => () => {
        this.setState({ removeStatus: FetchStatusEnum.loading }, async () => {
            try {
                await AddressApi.removeAddress(this.props.user.id, addressId, this.props.authToken);
                Router.reload();
            } catch (error) {
                this.setState({ removeStatus: FetchStatusEnum.failure });
            }
        });
    };

    private handleClickSetMainAddress = (addressId: string) => () => {
        this.setState({ setMainAddressStatus: FetchStatusEnum.loading }, async () => {
            try {
                await AddressApi.setMainAddress(this.props.user.id, addressId, this.props.authToken);
                Router.reload();
            } catch (error) {
                this.setState({ setMainAddressStatus: FetchStatusEnum.failure });
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
                        />
                    );
                })}
            </div>
        );
    }

    private renderFetchStatus() {
        // TODO probably it's a good idea to merge all fetch status into one
        const { fetchStatus } = this.state;

        if (fetchStatus === FetchStatusEnum.loading) {
            return <div className={styles['loading-circle']}><Spinner animation="border" variant="info" /></div>;
        } else if (fetchStatus === FetchStatusEnum.failure) {
            return <Alert variant="danger">Failed fetching user addresses.</Alert>;
        }

        return null;
    }

    private renderRemoveStatus() {
        const { removeStatus } = this.state;

        if (removeStatus === FetchStatusEnum.loading) {
            return <div className={styles['loading-circle']}><Spinner animation="border" variant="info" /></div>;
        } else if (removeStatus === FetchStatusEnum.failure) {
            return <Alert variant="danger">Failed removing address.</Alert>;
        }

        return null;
    }

    private renderSetMainAddressStatus() {
        const { setMainAddressStatus } = this.state;

        if (setMainAddressStatus === FetchStatusEnum.loading) {
            return <div className={styles['loading-circle']}><Spinner animation="border" variant="info" /></div>;
        } else if (setMainAddressStatus === FetchStatusEnum.failure) {
            return <Alert variant="danger">Failed setting main address.</Alert>;
        }

        return null;
    }

    private handleClickAddNewAddress = () => {
        Router.push('/account/addresses/new');
    };

    public render() {
        return (
            <Layout title="My addresses" showNav={true} customContentClass={styles['custom-layout-content']}>
                <BaseStructure activeMenuItem={SideMenuItemEnum.addresses}>
                    <div className={styles['addresses-container']}>
                        <div>
                            <h4>My addresses</h4>
                            {this.renderFetchStatus()}
                            {this.renderRemoveStatus()}
                            {this.renderSetMainAddressStatus()}
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
    user: getUser(state.user)
});

export default connect(mapStateToProps)(withAuthenticationCheck(AddressesPage));
