import React from 'react';
import { Layout } from '../components/layout';
import Router from 'next/router';
import Spinner from 'react-bootstrap/Spinner';
import * as ProductApi from '../modules/products/api';
import { FetchStatusEnum, FetchStatus } from '../utils/api-helper';
import { Product } from '../modules/products/model';
import { ProductList } from '../components/products/product-list';

import styles from './index.module.scss';
import { SearchBar } from '../widgets/search-bar/search-bar';

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
                <div className={styles['index-page']}>
                    {/* TODO Create component for search bar */}
                    <SearchBar
                        onChange={this.handleChangeSearchTerm}
                        onKeyUp={this.handleKeyUp}
                        onClickSearch={this.handleClickSearch}
                        value={this.state.searchTerm}
                    />
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
