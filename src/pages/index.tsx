import React from 'react';
import { Layout } from '../components/layout/layout';
import Router from 'next/router';
import { CustomSpinner } from '../components/custom-spinner/custom-spinner';
import * as ProductApi from '../modules/products/api';
import { FetchStatusEnum, FetchStatus } from '../utils/api-helper';
import { Product } from '../modules/products/model';
import { ProductList } from '../components/products/product-list';
import { SearchBar } from '../components/search-bar/search-bar';
import { CustomStatusBox } from '../components/custom-status-box/custom-status-box';

import styles from './index.module.scss';

interface State {
    searchTerm: string;
    searchStatus: FetchStatus;
    consoles: Product[];
    games: Product[];
}

export default class Index extends React.PureComponent<{}, State> {
    public state: State = {
        searchTerm: '',
        searchStatus: FetchStatusEnum.loading,
        consoles: [],
        games: []
    };

    public componentDidMount() {
        this.setState({ searchStatus: FetchStatusEnum.loading }, async () => {
            try {
                const { consoles, games } = await ProductApi.getFeaturedProducts();
                this.setState({ searchStatus: FetchStatusEnum.success, consoles, games });
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
            return <CustomSpinner />;
        } else if (searchStatus === FetchStatusEnum.failure) {
            return <CustomStatusBox type="danger" style={{ marginTop: '10px' }}>Failed getting featured products.</CustomStatusBox>;
        }

        return null;
    }

    public render() {
        return (
            <Layout title="Home" showNav showFooter>
                <div className={styles['index-page']}>
                    <SearchBar
                        onChange={this.handleChangeSearchTerm}
                        onKeyUp={this.handleKeyUp}
                        onClickSearch={this.handleClickSearch}
                        value={this.state.searchTerm}
                    />
                    <div className={styles['products-container']}>
                        <div className={styles.products}>
                            {this.renderSearchStatus()}
                            <h5 className={styles['section-title']}>Featured Games</h5>
                            <ProductList products={this.state.games} emptyStateMessage="No games found." />
                            <hr className={styles['custom-hr']} />
                            <h5 className={styles['section-title']}>Featured Consoles</h5>
                            <ProductList products={this.state.consoles} emptyStateMessage="No consoles found." />
                        </div>
                    </div>
                </div>
            </Layout>
        );
    }
};
