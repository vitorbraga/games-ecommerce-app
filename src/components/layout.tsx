import * as React from 'react';
import Router from 'next/router';
import classNames from 'classnames';
import Head from 'next/head';
import Image from 'react-bootstrap/Image';
import { UserBoxContainer } from '../container/UserBoxContainer';
import { CartBoxContainer } from '../container/CartBoxContainer';

import styles from './layout.module.scss';

interface Props {
    title?: string;
    showNav: boolean;
    customContentClass?: string;
}

export const Layout: React.FunctionComponent<Props> = ({ children, title, showNav, customContentClass }) => {
    const handleLogoClick = () => {
        Router.push('/');
    };

    return (
        <div className={styles.layout}>
            <Head>
                <title>{title}</title>
                <meta charSet="utf-8" />
                <meta name="viewport" content="initial-scale=1.0, width=device-width" />
                <link rel="stylesheet" href="styles.css"/>
            </Head>
            {showNav
            && <div className={styles['top-bar']}>
                <div className={styles['top-bar-wrapper']}>
                    <Image src="/logo.png" className={styles.logo} onClick={handleLogoClick} />
                    <div className={styles['right-box']}>
                        <UserBoxContainer />
                        <CartBoxContainer />
                    </div>
                </div>
            </div>
            }
            <div className={classNames(styles.content, customContentClass)}>
                {children}
            </div>
        </div>
    );
};
