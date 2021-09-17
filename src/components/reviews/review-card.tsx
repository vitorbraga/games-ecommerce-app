import * as React from 'react';
import Router from 'next/router';
import { Image } from 'react-bootstrap';
import { Review } from '../../modules/reviews/model';
import { generatePictureURL } from '../../utils/api-helper';
import * as DateUtils from '../../utils/date-utils';

import styles from './review-card.module.scss';

interface Props {
    review: Review;
}

export const ReviewCard: React.FC<Props> = ({ review }) => {
    const { product } = review;

    return (
        <div className={styles['review-card']}>
            <div className={styles['data-box']}>
                <div className={styles.rating}>{review.rating} / 5</div>
                <div className={styles.title}>{review.title}</div>
                <div className={styles.description}>{review.description}</div>
                <div className={styles.date}>{DateUtils.formatDateFromMilliseconds(review.createdAt, 'LLL')}</div>
            </div>
            {product
                && <a href={`/products/${product!.id}`}>
                    <Image
                        title={product.title}
                        src={generatePictureURL(product.picture.filename)}
                        className={styles['picture-thumb']}
                    />
                </a>}
        </div>
    );
};
