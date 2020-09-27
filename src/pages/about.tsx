import React from 'react';
import { Image } from 'react-bootstrap';
import { Layout } from '../components/layout/layout';

import styles from './about.module.scss';

const AboutPage: React.FC<{}> = () => {
    return (
        <Layout title="About" showNav showFooter>
            <div className={styles['about-container']}>
                <div className={styles.project}>
                    <h3>About the project</h3>
                    <p>This project is a simple Ecommerce, where users are "able to buy Games and Video Game Consoles".</p>
                    <p>Actually, all the flows and transactions are fake, so there are no real products and no real purchases. It's just a proof of concept of an ecommerce
                        that I wanted to build. And it's still under development.I have lots of features I want to add, and I will do it over time.</p>
                    <p>The website you're seeing now is the Ecommerce Store, where users are able to register, log in, search for products, make their purchases, and keep track of their orders.
                    There is also an Admin Portal, where administrators can register products and manage them. And of course, there is a backend service that stores all the data and provides
                    ways for the Ecommerce Store and the Admin Portal to access this data.</p>
                    <h5 style={{ marginTop: '20px' }}>Stack</h5>
                    <dl>
                        <dt>Backend:</dt>
                        <dd>Nodejs, Typescript, and PostgresQL</dd>
                        <dt>Ecommerce Store:</dt>
                        <dd>NextJs, ReactJs, Redux, Typescript</dd>
                        <dt>Admin portal:</dt>
                        <dd>React, Typescript</dd>
                        <dt>Interesting libraries:</dt>
                        <dd>Formik, Yup, React-bootstrap, Material-UI, TypeORM, Express</dd>
                    </dl>
                    <p><em>This project does not use any Ecommerce frameworks like Shopify, Magento or WooCommerce. All ecommerce logics were implemented from scratch.</em></p>
                </div>
                <div className={styles.author}>
                    <h3>About the author</h3>
                    <div className={styles['my-profile']}>
                        <div className={styles['left-wrapper']}>
                            <p>
                                Hi! My name is Vitor Braga and I'm a Software Engineer, focused on Full-Stack Development. I've been working with software development
                                for about 8 years and through these years I could experiment with different languages and frameworks.
                            </p>
                            <p>
                                Currently, I'm more into Javascript development, as I've been working with ReactJs for front-end and NodeJs for back-end, both using Typescript on the top.
                            </p>
                            <p>
                                In case you want to know more about me, feel free to reach me out :)
                            </p>
                            <div className={styles['social-wrapper']}>
                                <a href="https://www.linkedin.com/in/vitor-braga-baa58655/" target="_blank">
                                    <Image src="/linkedin.svg" className={styles['social-icon']} title="LinkedIn" />
                                </a>
                                <a href="https://github.com/vitorbraga" target="_blank">
                                    <Image src="/github.svg" className={styles['social-icon']} title="GitHub" />
                                </a>
                            </div>
                        </div>
                        <div className={styles['right-wrapper']}>
                            <Image src="/me.png" className={styles.me} title="It's me with surrounded by tulips" alt="It's me with surrounded by tulips" />
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default AboutPage;
