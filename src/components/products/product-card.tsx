import * as React from 'react';
import Router from 'next/router';
import Card from 'react-bootstrap/Card';
import { Product } from '../../modules/products/model';
import { generatePictureURL } from '../../utils/api-helper';
import { formatPrice } from '../../utils/money-utils';

import styles from './product-card.module.scss';

interface Props {
    product: Product;
}

export const ProductCard: React.FC<Props> = ({ product }) => {
    const productDetailsUrl = `/products/${product.id}`;

    const handleRedirectClick = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        if (event.ctrlKey) {
            window.open(productDetailsUrl, '_blank');
        } else {
            Router.push(productDetailsUrl);
        }
    };

    const handleMouseDown = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        if (event.button === 1) {
            window.open(productDetailsUrl, '_blank');
        }
    };

    const imagePath = generatePictureURL(product.pictures[0].filename);

    return (
        <Card className={styles['product-card']} onClick={handleRedirectClick} onMouseDown={handleMouseDown}>
            <Card.Img variant="top" src={imagePath} className={styles.image} />
            <Card.Body className={styles['custom-card-body']}>
                <Card.Title className={styles.title}>{product.title}</Card.Title>
                <Card.Subtitle className={styles.subtitle}>{formatPrice(product.price)}</Card.Subtitle>
            </Card.Body>
        </Card>
    );
};
