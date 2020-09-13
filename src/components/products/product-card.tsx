import * as React from 'react';
import Router from 'next/router';
import Card from 'react-bootstrap/Card';
import { Product } from '../../modules/products/model';
import { generatePictureURL } from '../../utils/api-helper';
import { formatPrice } from '../../utils/common-helper';

import styles from './product-card.module.scss';

interface Props {
    product: Product;
}

export class ProductCard extends React.PureComponent<Props, never> {
    private handleRedirectClick = () => {
        Router.push(`/products/${this.props.product.id}`);
    };

    public render() {
        const { product } = this.props;
        const imagePath = generatePictureURL(product.pictures[0].filename);

        return (
            <Card className={styles['product-card']} onClick={this.handleRedirectClick}>
                <Card.Img variant="top" src={imagePath} className={styles.image} />
                <Card.Body className={styles['custom-card-body']}>
                    <Card.Title className={styles.title}>{product.title}</Card.Title>
                    <Card.Subtitle className={styles.subtitle}>{formatPrice(product.price)}</Card.Subtitle>
                </Card.Body>
            </Card>
        );
    }
}
