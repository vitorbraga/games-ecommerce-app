import * as React from 'react';
import classNames from 'classnames';
import Head from 'next/head';
import Image from 'react-bootstrap/Image';
import { AuthenticationBoxContainer } from '../container/AuthenticationBoxContainer';

import styles from './layout.module.scss';

interface Props {
    title?: string;
    showNav: boolean;
    customContentClass?: string;
}

const Layout: React.FunctionComponent<Props> = ({ children, title, showNav, customContentClass }) => (
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
                    <Image src="/logo-2.PNG" className={styles.logo} />
                    <AuthenticationBoxContainer />
                </div>
            </div>
        }
        <div className={classNames(styles.content, customContentClass)}>
            {children}
        </div>
    </div>
);

export { Layout };
