import React from 'react';
import { Layout } from '../components/layout';
import Button from 'react-bootstrap/Button';
import InputGroup from 'react-bootstrap/InputGroup';
import FormControl from 'react-bootstrap/FormControl';

import styles from './index.module.scss';

const Index: React.FunctionComponent = () => {
    return (
        <Layout title="Home" showNav={true} customContentClass={styles['custom-content']}>
            <div className={styles['index-container']}>
                <div className={styles['search-bar']}>
                    <InputGroup className={styles['search-bar-input']}>
                        <FormControl
                            placeholder="What are you looking for?"
                            aria-label="Recipient's username"
                            aria-describedby="basic-addon2"
                        />
                        <InputGroup.Append>
                            <Button variant="outline-secondary">Search</Button>
                        </InputGroup.Append>
                    </InputGroup>
                </div>
                <div className={styles['products-container']}>
                    <div className={styles.sidebar}></div>
                    <div className={styles.products}></div>
                </div>
            </div>
        </Layout>
    );
};

export default Index;
