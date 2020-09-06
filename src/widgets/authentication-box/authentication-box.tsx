import * as React from 'react';
import { User } from '../../modules/user/model';
import Link from 'next/link';

import styles from './authentication-box.module.scss';

interface Props {
    user: User | null;
    userLogout: () => void;
}

export class AuthenticationBox extends React.PureComponent<Props, never> {
    private handleClickLogout = () => {
        this.props.userLogout();
    };

    public render() {
        const { user } = this.props;
        console.log('render', user);
        if (user) {
            return (
                <div className={styles['logged-wrapper']}>
                    <div>Logged as {user.firstName}</div>
                    <a onClick={this.handleClickLogout}>
                        Logout
                    </a>
                </div>
            );
        }

        return (
            <div className={styles['not-logged-wrapper']}>
                <Link href="/login">
                    <a className={styles['regular-link']}>Login</a>
                </Link>
                <Link href="/register">
                    <a className={styles['regular-link']}>Register</a>
                </Link>
            </div>
        );
    }
}
