import * as React from 'react';
import shallowEqual from 'shallowequal';
import Router from 'next/router';
import { Layout } from '../../components/layout';
import Spinner from 'react-bootstrap/Spinner';
import { FetchStatusEnum } from '../../utils/api-helper';
import { Product } from '../../modules/products/model';
import { ProductList } from '../../components/products/product-list';
import * as ProductApi from '../../modules/products/api';
import { ParsedUrlQuery } from 'querystring';
import { SearchBar } from '../../widgets/search-bar/search-bar';
import { Sidebar } from './sidebar';

import styles from './search.module.scss';

interface Props {
    query: ParsedUrlQuery;
}

function SearchPage({ query: { term, categories } }: Props) {
    const [searchTerm, setSearchTerm] = React.useState('');
    const [selectedCategories, setSelectedCategories] = React.useState([] as string[]);
    const [productsFetch, setProductsFetch] = React.useState({ products: [] as Product[], searchStatus: FetchStatusEnum.initial });

    async function makeSearch() {
        setProductsFetch({ products: [], searchStatus: FetchStatusEnum.loading });
        try {
            const categoriesParam = categories ? (categories as string) : '';
            const products = await ProductApi.searchProducts(term as string, categoriesParam);
            setProductsFetch({ products, searchStatus: FetchStatusEnum.success });
        } catch (error) {
            setProductsFetch({ products: [], searchStatus: FetchStatusEnum.failure });
        }
    }

    React.useEffect(() => {
        setSearchTerm(term as string);
        const newCategories = categories ? categories.toString().split(',') : [];
        setSelectedCategories(newCategories);

        makeSearch();
    }, [term, categories]);

    const renderSearchStatus = () => {
        if (productsFetch.searchStatus === FetchStatusEnum.loading) {
            return <div className={styles['loading-circle']}><Spinner animation="border" variant="info" /></div>;
        }
        // TODO finish this
        return null;
    };

    const updateUrl = (categories?: string[]) => {
        Router.push({
            pathname: '/products/search',
            query: {
                term: searchTerm || '',
                categories: categories && categories.length > 0 ? categories.join(',') : ''
            }
        });
    };

    const handleSearch = () => {
        if (searchTerm === term && shallowEqual(selectedCategories, categories)) {
            makeSearch();
        } else {
            updateUrl();
        }
    };

    const handleClickSearch = async () => {
        handleSearch();
    };

    const handleKeyUp = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'Enter') {
            handleSearch();
        }
    };

    const handleChangeSearchTerm = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(event.target.value);
    };

    const handleSelectFilter = (categoryId: string, checked: boolean) => {
        const newCategories = checked
            ? [...selectedCategories, categoryId]
            : [...selectedCategories.filter((item) => item !== categoryId)];

        updateUrl(newCategories);
    };

    return (
        <Layout title="Search products" showNav={true} customContentClass={styles['custom-content']}>
            <div className={styles['search-container']}>
                <SearchBar
                    onChange={handleChangeSearchTerm}
                    onKeyUp={handleKeyUp}
                    onClickSearch={handleClickSearch}
                    value={searchTerm}
                />
                <div className={styles['products-container']}>
                    <div className={styles.sidebar}>
                        <Sidebar onSelectFilter={handleSelectFilter} selectedCategories={selectedCategories} />
                    </div>
                    <div className={styles.products}>
                        {renderSearchStatus()}
                        <div className={styles['results-info']}>
                            <div>{productsFetch.products.length} results</div>
                            <div>Sort by</div>
                        </div>
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
