import * as React from 'react';
import { Product } from '../../modules/products/model';
import { ProductCard } from './product-card';

import styles from './product-list.module.scss';

interface Props {
    products: Product[];
    style?: React.CSSProperties;
    emptyStateMessage?: string;
}

export const ProductList: React.FC<Props> = ({ products, style, emptyStateMessage }) => {
    if (products.length === 0) {
        return <div className={styles['empty-state']}>{emptyStateMessage || 'No products found.'}</div>;
    }

    return (
        <div className={styles['product-list']} style={style}>
            {products.map((product, index) => {
                return (
                    <ProductCard product={product} key={`product-card-${index}`} />
                );
            })}
        </div>
    );
};
