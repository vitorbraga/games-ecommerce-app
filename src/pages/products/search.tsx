import * as React from 'react';
import Router from 'next/router';
import { Layout } from '../../components/layout';
import Spinner from 'react-bootstrap/Spinner';
import { FetchStatusEnum } from '../../utils/api-helper';
import { Product } from '../../modules/products/model';
import { ProductList } from '../../components/products/product-list';
import * as ProductApi from '../../modules/products/api';
import { ParsedUrlQuery } from 'querystring';

import styles from './search.module.scss';
import { SearchBar } from '../../widgets/search-bar/search-bar';

interface Props {
    query: ParsedUrlQuery;
}

function SearchPage({ query: { term } }: Props) {
    const [searchTerm, setSearchTerm] = React.useState('');
    const [productsFetch, setProductsFetch] = React.useState({ products: [] as Product[], searchStatus: FetchStatusEnum.initial });

    React.useEffect(() => {
        async function update() {
            setProductsFetch({ products: [], searchStatus: FetchStatusEnum.loading });
            setSearchTerm(term as string);
            try {
                const products = await ProductApi.searchProducts(term as string);
                setProductsFetch({ products, searchStatus: FetchStatusEnum.success });
            } catch (error) {
                setProductsFetch({ products: [], searchStatus: FetchStatusEnum.failure });
            }
        }

        update();
    }, [term]);

    const renderSearchStatus = () => {
        if (productsFetch.searchStatus === FetchStatusEnum.loading) {
            return <div className={styles['loading-circle']}><Spinner animation="border" variant="info" /></div>;
        }
        // TODO finish this
        return null;
    };

    const updateUrlAndReload = () => {
        Router.push(`/products/search?term=${searchTerm}`);
    };

    const handleClickSearch = async () => {
        updateUrlAndReload();
    };

    const handleKeyUp = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'Enter') {
            updateUrlAndReload();
        }
    };

    const handleChangeSearchTerm = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(event.target.value);
    };

    return (
        <Layout title="Home" showNav={true} customContentClass={styles['custom-content']}>
            <div className={styles['search-container']}>
                <SearchBar
                    onChange={handleChangeSearchTerm}
                    onKeyUp={handleKeyUp}
                    onClickSearch={handleClickSearch}
                    value={searchTerm}
                />
                <div className={styles['products-container']}>
                    <div className={styles.sidebar}></div>
                    <div className={styles.products}>
                        {renderSearchStatus()}
                        <ProductList products={productsFetch.products} />
                    </div>
                </div>
            </div>
        </Layout>
    );
};

SearchPage.getInitialProps = ({ query }: any) => {
    return { query };
};

export default SearchPage;
