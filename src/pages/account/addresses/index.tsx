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
import { Address } from '../../../modules/address/model';
import { User } from '../../../modules/user/model';
import { getUser } from '../../../modules/user/selector';
import { AppState } from '../../../store';
import { FetchStatus, FetchStatusEnum } from '../../../utils/api-helper';
import { withAuthenticationCheck } from '../../../utils/authentication-wrapper';

import styles from './index.module.scss';
import { CustomButton } from '../../../widgets/custom-buttom/custom-button';

interface Props {
    authToken: string;
    user: User;
}

interface State {
    fetchStatus: FetchStatus;
    addresses: Address[];
    removeStatus: FetchStatus;
}

class AddressesPage extends React.PureComponent<Props, State> {
    public state: State = {
        fetchStatus: FetchStatusEnum.initial,
        addresses: [],
        removeStatus: FetchStatusEnum.initial
    };

    public componentDidMount() {
        this.setState({ fetchStatus: FetchStatusEnum.loading }, async () => {
            try {
                const addresses = await AddressApi.getUserAddresses(this.props.user.id, this.props.authToken);
                this.setState({ fetchStatus: FetchStatusEnum.success, addresses });
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

    private renderUserAddresses() {
        const { addresses } = this.state;

        if (addresses.length === 0) {
            return <div className={styles['empty-state']}>You don't have registered addresses. Click here to add one.</div>;
        }

        return (
            <div className={styles['current-addresses-wrapper']}>
                {addresses.map((address, index) => {
                    return (
                        <Card className={styles['address-card']} key={`address-${index}`}>
                            <Card.Body>
                                <Card.Title className={styles['card-title']}>{address.fullName}</Card.Title>
                                <div className={styles['card-body']}>
                                    <div>
                                        <div>{address.line1}</div>
                                        <div>{address.line2}</div>
                                        <div>{`${address.city}, ${address.country.name}`}</div>
                                        <div>{address.zipCode}</div>
                                        <div><i>{address.info}</i></div>
                                    </div>
                                </div>
                            </Card.Body>
                            <Card.Footer>
                                <div className={styles['card-actions']}>
                                    <Card.Link className={styles.link}>Set as main address</Card.Link>
                                    <Card.Link className={styles.link} onClick={this.handleClickRemoveAddress(address.id)}>Remove</Card.Link>
                                </div>
                            </Card.Footer>
                        </Card>
                    );
                })}
            </div>
        );
    }

    private renderFetchStatus() {
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
