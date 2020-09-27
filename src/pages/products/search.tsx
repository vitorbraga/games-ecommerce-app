import * as React from 'react';
import shallowEqual from 'shallowequal';
import { ParsedUrlQuery } from 'querystring';
import Router from 'next/router';
import { Layout } from '../../components/layout/layout';
import Form from 'react-bootstrap/Form';
import { FetchStatusEnum } from '../../utils/api-helper';
import { Product } from '../../modules/products/model';
import { ProductList } from '../../components/products/product-list';
import * as ProductApi from '../../modules/products/api';
import { SearchBar } from '../../components/search-bar/search-bar';
import { Sidebar } from './sidebar';
import { CustomSpinner } from '../../components/custom-spinner/custom-spinner';

import styles from './search.module.scss';
import { CustomErrorBox } from '../../components/custom-error-box/custom-error-box';

interface Props {
    query: ParsedUrlQuery;
}

enum SearchSortType {
    NONE = 'NONE',
    PRICE_LOW_HIGH = 'PRICE_LOW_HIGH',
    PRICE_HIGH_LOW = 'PRICE_HIGH_LOW'
}

function SearchPage({ query: { term, categories, sortType } }: Props) {
    const [searchTerm, setSearchTerm] = React.useState('');
    const [selectedCategories, setSelectedCategories] = React.useState([] as string[]);
    const [selectedSortType, setSelectedSortType] = React.useState('');
    const [productsFetch, setProductsFetch] = React.useState({ products: [] as Product[], searchStatus: FetchStatusEnum.initial });

    async function makeSearch() {
        setProductsFetch({ products: [], searchStatus: FetchStatusEnum.loading });
        try {
            const categoriesParam = categories ? (categories as string) : '';
            const products = await ProductApi.searchProducts(term as string, categoriesParam, sortType as string);
            setProductsFetch({ products, searchStatus: FetchStatusEnum.success });
        } catch (error) {
            setProductsFetch({ products: [], searchStatus: FetchStatusEnum.failure });
        }
    }

    React.useEffect(() => {
        setSearchTerm(term as string);
        const newCategories = categories ? categories.toString().split(',') : [];
        setSelectedCategories(newCategories);
        setSelectedSortType(sortType as string);

        makeSearch();
    }, [term, categories, sortType]);

    const renderSearchStatus = () => {
        if (productsFetch.searchStatus === FetchStatusEnum.loading) {
            return <CustomSpinner />;
        } else if (productsFetch.searchStatus === FetchStatusEnum.failure) {
            return <CustomErrorBox>Failed searching products.</CustomErrorBox>;
        }

        return null;
    };

    const updateUrl = (categories?: string[], sortType?: string) => {
        Router.push({
            pathname: '/products/search',
            query: {
                term: searchTerm || '',
                categories: categories && categories.length > 0 ? categories.join(',') : '',
                sortType: sortType || 'NONE'
            }
        });
    };

    const handleSearch = () => {
        if (searchTerm === term
            && shallowEqual(selectedCategories, categories)
            && selectedSortType === sortType
        ) {
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

    const handleSelectSortType = (event: React.ChangeEvent<HTMLInputElement>) => {
        const sortType = event.target.value;
        updateUrl(undefined, sortType);
    };

    return (
        <Layout title="Search products" showNav showFooter customContentClass={styles['custom-content']}>
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
                            <Form.Control as="select" className={styles['select-input']} onChange={handleSelectSortType} value={selectedSortType}>
                                <option value={SearchSortType.NONE}>Sort by</option>
                                <option value={SearchSortType.PRICE_LOW_HIGH}>Price low - high</option>
                                <option value={SearchSortType.PRICE_HIGH_LOW}>Price high - low</option>
                            </Form.Control>
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
