import * as React from 'react';
import Router from 'next/router';
import { User } from '../../modules/user/model';
import Link from 'next/link';
import Popover from 'react-bootstrap/Popover';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import ListGroup from 'react-bootstrap/ListGroup';

import styles from './user-box.module.scss';

interface Props {
    user: User | null;
    userLogout: () => void;
}

export class UserBox extends React.PureComponent<Props, never> {
    private handleClickLogout = async () => {
        await Router.push('/');
        this.props.userLogout();
    };

    private handleRedirectTo = (route: string) => () => {
        Router.push(route);
    };

    public render() {
        const { user } = this.props;
        if (user) {
            const popover = (
                <Popover id="popover-logged-user" style={{ borderRadius: '0' }}>
                    <ListGroup>
                        <ListGroup.Item
                            action
                            onClick={this.handleRedirectTo('/account')}
                            className={styles['list-item']}
                            style={{ border: 'none' }}
                        >
                            Account overview
                        </ListGroup.Item>
                        <ListGroup.Item
                            action
                            onClick={this.handleRedirectTo('/account/orders')}
                            className={styles['list-item']}
                            style={{ border: 'none', borderBottom: '1px solid rgba(0, 0, 0, .125)', borderTop: '1px solid rgba(0, 0, 0, .125)' }}
                        >
                            My orders
                        </ListGroup.Item>
                        <ListGroup.Item
                            action
                            onClick={this.handleClickLogout}
                            className={styles['list-item']}
                            style={{ border: 'none' }}
                        >
                            Logout
                        </ListGroup.Item>
                    </ListGroup>
                </Popover>
            );

            return (
                <div className={styles['logged-wrapper']}>
                    <div className={styles['name-wrapper']}>
                        <div>Welcome</div>
                        <div><b>{user.firstName}</b></div>
                    </div>
                    <OverlayTrigger trigger="click" placement="bottom-end" rootClose overlay={popover}>
                        <img src="/user.svg" className={styles['user-icon']} />
                    </OverlayTrigger>
                </div>
            );
        }

        return (
            <div className={styles['not-logged-wrapper']}>
                <Link href="/login">
                    <a className={styles.link}>Login</a>
                </Link>
                <Link href="/register">
                    <a className={styles.link}>Register</a>
                </Link>
            </div>
        );
    }
}
