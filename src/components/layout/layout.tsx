import * as React from 'react';
import Router from 'next/router';
import classNames from 'classnames';
import Head from 'next/head';
import Link from 'next/link';
import Image from 'react-bootstrap/Image';
import { CartBoxContainer } from '../cart-box/cart-box';
import { UserBoxContainer } from '../user-box/user-box';

import styles from './layout.module.scss';

interface Props {
    title?: string;
    showNav?: boolean;
    showFooter?: boolean;
    customContentClass?: string;
}

export const Layout: React.FunctionComponent<Props> = ({ children, title, showNav, showFooter, customContentClass }) => {
    const handleLogoClick = () => {
        Router.push('/');
    };

    return (
        <div className={styles.layout}>
            <Head>
                <title>{title}</title>
                <meta charSet="utf-8" />
                <meta name="viewport" content="initial-scale=1.0, width=device-width" />
                <link rel="stylesheet" href="styles.css" />
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
            {showFooter
                && <div className={styles.footer}>
                    <div className={styles['footer-wrapper']}>
                        <ul className={styles.links}>
                            <li className={styles['list-item']}><Link href="/about"><a className={styles.link}>About us</a></Link></li>
                            <li className={styles['list-item']}><Link href="/about"><a className={styles.link}>Terms and Conditions</a></Link></li>
                        </ul>
                        <div className={styles.signature}>© 2020, Vitor Braga</div>
                    </div>
                </div>
            }
        </div>
    );
};
