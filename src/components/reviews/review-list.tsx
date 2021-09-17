import * as React from 'react';
import { Review } from '../../modules/products/model';

interface Props {
    reviews: Review[];
}

export const ReviewList: React.FC<Props> = ({ reviews }) => {
    return (
        <div>review list {reviews.length}</div>
    );
};
