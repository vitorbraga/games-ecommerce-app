import * as React from 'react';
import Router from 'next/router';
import Head from 'next/head';
import Link from 'next/link';
import Image from 'react-bootstrap/Image';
import { CartBoxContainer } from '../cart-box/cart-box';
import { UserBoxContainer } from '../user-box/user-box';
import Container from 'react-bootstrap/Container';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';

import styles from './layout.module.scss';

interface Props {
    title?: string;
    showNav?: boolean;
    showFooter?: boolean;
}

export const Layout: React.FunctionComponent<Props> = ({ children, title, showNav, showFooter }) => {
    const handleLogoClick = () => {
        Router.push('/');
    };

    return (
        <Container fluid="lg" style={{ height: '100%' }}>
            <Head>
                <title>{title}</title>
                <meta charSet="utf-8" />
                <meta name="viewport" content="initial-scale=1.0, width=device-width" />
                <link rel="stylesheet" href="styles.css" />
            </Head>
            {showNav
                && <Row>
                    <Col>
                        <div className={styles['top-bar']}>
                            <Image src="/logo.png" className={styles.logo} onClick={handleLogoClick} />
                            <div className={styles['right-box']}>
                                <UserBoxContainer />
                                <CartBoxContainer />
                            </div>
                        </div>
                    </Col>
                </Row>
            }
            <Row>
                <Col>
                    <div className={styles['main-content']}>
                        {children}
                    </div>
                </Col>
            </Row>
            {showFooter
                && <Row>
                    <Col>
                        <div className={styles.footer}>
                            <div className={styles['footer-wrapper']}>
                                <ul className={styles.links}>
                                    <li className={styles['list-item']}><Link href="/about"><a className={styles.link}>About</a></Link></li>
                                    <li className={styles['list-item']}><Link href="/terms-and-conditions"><a className={styles.link}>Terms and Conditions</a></Link></li>
                                </ul>
                                <div className={styles.signature}>© 2020, Vitor Braga</div>
                            </div>
                        </div>
                    </Col>
                </Row>

            }
        </Container>
    );
};
