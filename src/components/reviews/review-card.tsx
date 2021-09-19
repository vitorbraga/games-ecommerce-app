import * as React from 'react';
import classNames from 'classnames';
import { Image } from 'react-bootstrap';
import { Review } from '../../modules/reviews/model';
import { generatePictureURL } from '../../utils/api-helper';
import * as DateUtils from '../../utils/date-utils';
import { ExpandableDiv } from '../expandable-div/expandable-div';
import { StarRating } from '../start-rating/star-rating';

import styles from './review-card.module.scss';

interface Props {
    review: Review;
    onRemove?: () => void;
}

export const ReviewCard: React.FC<Props> = ({ review, onRemove }) => {
    const { product } = review;

    return (
        <div className={styles['review-card']}>
            <div className={styles['top-line']}>
                <div className={styles.rating} title={`${review.rating} / 5`}>
                    <StarRating numberOfStars={review.rating} />
                    {onRemove && <span onClick={onRemove} title="Remove review" className={classNames(styles.link, styles['remove-link'])}>Remove</span>}
                </div>
                <div className={styles.date}>{DateUtils.formatDateFromMilliseconds(review.createdAt, 'LLL')}</div>
            </div>
            <div className={styles['bottom-line']}>
                <div className={styles['data-box']}>
                    <div className={styles.title}>{review.title}</div>
                    <div className={styles.description}>
                        <ExpandableDiv text={review.description} maxChars={30} />
                    </div>
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
        </div>
    );
};
