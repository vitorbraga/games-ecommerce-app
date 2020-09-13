import React from 'react';
import { Layout } from '../components/layout';
import Router from 'next/router';
import Button from 'react-bootstrap/Button';
import InputGroup from 'react-bootstrap/InputGroup';
import FormControl from 'react-bootstrap/FormControl';
import Spinner from 'react-bootstrap/Spinner';
import * as ProductApi from '../modules/products/api';
import { FetchStatusEnum, FetchStatus } from '../utils/api-helper';
import { Product } from '../modules/products/model';
import { ProductList } from '../components/products/product-list';

import styles from './index.module.scss';

interface State {
    searchTerm: string;
    searchStatus: FetchStatus;
    products: Product[];
}

export default class Index extends React.PureComponent<{}, State> {
    public state: State = {
        searchTerm: '',
        searchStatus: FetchStatusEnum.initial,
        products: []
    };

    public componentDidMount() {
        this.setState({ searchStatus: FetchStatusEnum.loading }, async () => {
            try {
                const products = await ProductApi.getFeaturedProducts();
                this.setState({ searchStatus: FetchStatusEnum.success, products });
            } catch (error) {
                this.setState({ searchStatus: FetchStatusEnum.failure });
            }
        });
    }

    private handleChangeSearchTerm = (event: React.ChangeEvent<HTMLInputElement>) => {
        this.setState({ searchTerm: event.target.value });
    };

    private redirectToSearchPage() {
        Router.push(`/products/search?term=${this.state.searchTerm}`);
    }

    private handleKeyUp = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'Enter') {
            this.redirectToSearchPage();
        }
    };

    private handleClickSearch = () => {
        this.redirectToSearchPage();
    };

    private renderSearchStatus() {
        const { searchStatus } = this.state;

        if (searchStatus === FetchStatusEnum.loading) {
            return <div className={styles['loading-circle']}><Spinner animation="border" variant="info" /></div>;
        }
        // TODO finish this
        return null;
    }

    public render() {
        return (
            <Layout title="Home" showNav={true} customContentClass={styles['custom-content']}>
                <div className={styles['index-container']}>
                    <div className={styles['search-bar']}>
                        <InputGroup className={styles['search-bar-input']}>
                            <FormControl
                                placeholder="What are you looking for?"
                                onChange={this.handleChangeSearchTerm}
                                onKeyUp={this.handleKeyUp}
                            />
                            <InputGroup.Append>
                                <Button variant="outline-secondary" onClick={this.handleClickSearch}>Search</Button>
                            </InputGroup.Append>
                        </InputGroup>
                    </div>
                    <div className={styles['products-container']}>
                        <div className={styles.sidebar}></div>
                        <div className={styles.products}>
                            {this.renderSearchStatus()}
                            <ProductList products={this.state.products} />
                        </div>
                    </div>
                </div>
            </Layout>
        );
    }
};
