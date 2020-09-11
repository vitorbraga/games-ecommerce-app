import * as React from 'react';
import Card from 'react-bootstrap/Card';
import { Product } from '../../modules/products/model';
import { generatePictureURL } from '../../utils/api-helper';

import styles from './product-card.module.scss';
import { CustomButton } from '../../widgets/custom-buttom/custom-button';

interface Props {
    product: Product;
}

export class ProductCard extends React.PureComponent<Props, never> {
    public render() {
        const { product } = this.props;
        const imagePath = generatePictureURL(product.pictures[0]?.filename);
        const description = product.description.substring(0, 130) + '...'; // FIXME find better solution

        return (
            <Card className={styles['product-card']}>
                <Card.Img variant="top" src={imagePath} className={styles.image} />
                <Card.Body className={styles['custom-card-body']}>
                    <Card.Title className={styles.title}>{product.title}</Card.Title>
                    <Card.Text className={styles.description}>
                        {description}
                    </Card.Text>
                    <CustomButton variant="primary" className={styles['add-to-cart-button']}>Add to cart</CustomButton>
                </Card.Body>
            </Card>
        );
    }
}
