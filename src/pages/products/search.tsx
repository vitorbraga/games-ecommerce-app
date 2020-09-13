import * as React from 'react';
import { NextRouter, useRouter } from 'next/router';
import { Layout } from '../../components/layout';
import Button from 'react-bootstrap/Button';
import InputGroup from 'react-bootstrap/InputGroup';
import FormControl from 'react-bootstrap/FormControl';
import Spinner from 'react-bootstrap/Spinner';
import { FetchStatusEnum, FetchStatus } from '../../utils/api-helper';
import { Product } from '../../modules/products/model';
import { ProductList } from '../../components/products/product-list';
import * as ProductApi from '../../modules/products/api';

import styles from './search.module.scss';

interface Props {
    router: NextRouter;
}

interface State {
    searchTerm: string;
    searchStatus: FetchStatus;
    products: Product[];
}

class Search extends React.PureComponent<Props, State> {
    public state: State = {
        searchTerm: this.getInitialQuery(),
        searchStatus: FetchStatusEnum.initial,
        products: []
    };

    private getInitialQuery() {
        if (this.props.router.query.q) {
            return this.props.router.query.q as string;
        }

        return '';
    }

    public componentDidMount() {
        this.setState({ searchStatus: FetchStatusEnum.loading }, async () => {
            try {
                const products = await ProductApi.searchProducts(this.state.searchTerm);
                this.setState({ searchStatus: FetchStatusEnum.success, products });
            } catch (error) {
                this.setState({ searchStatus: FetchStatusEnum.failure });
            }
        });
    }

    private renderSearchStatus() {
        const { searchStatus } = this.state;

        if (searchStatus === FetchStatusEnum.loading) {
            return <div className={styles['loading-circle']}><Spinner animation="border" variant="info" /></div>;
        }
        // TODO finish this
        return null;
    }

    private async updateUrlAndReload() {
        const { router } = this.props;
        await router.push(`/products/search?q=${this.state.searchTerm}`);
        router.reload();
    }

    private handleClickSearch = async () => {
        this.updateUrlAndReload();
    };

    private handleKeyUp = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'Enter') {
            this.updateUrlAndReload();
        }
    };

    private handleChangeSearchTerm = (event: React.ChangeEvent<HTMLInputElement>) => {
        this.setState({ searchTerm: event.target.value });
    };

    public render() {
        return (
            <Layout title="Home" showNav={true} customContentClass={styles['custom-content']}>
                <div className={styles['search-container']}>
                    <div className={styles['search-bar']}>
                        <InputGroup className={styles['search-bar-input']}>
                            <FormControl
                                onChange={this.handleChangeSearchTerm}
                                onKeyUp={this.handleKeyUp}
                                value={this.state.searchTerm}
                                placeholder="What are you looking for?"
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

const SearchWithRouter = () => {
    const router = useRouter();
    return <Search router={router} />;
};

export async function getServerSideProps() {
    return {
        props: {}
    };
}

export default SearchWithRouter;
