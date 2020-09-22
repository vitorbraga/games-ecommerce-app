import * as React from 'react';
import { Product } from '../../modules/products/model';
import { ProductCard } from './product-card';

import styles from './product-list.module.scss';

interface Props {
    products: Product[];
}

export class ProductList extends React.PureComponent<Props, never> {
    public render() {
        const { products } = this.props;
        if (products.length === 0) {
            return <div style={{ padding: '20px' }}>No products found</div>;
        }

        return (
            <div className={styles['product-list']}>
                {products.map((product, index) => {
                    return (
                        <ProductCard product={product} key={`product-card-${index}`} />
                    );
                })}
            </div>
        );
    }
}
