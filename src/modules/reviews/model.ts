import { BasicProduct } from '../products/model';

export interface Review {
    id: string;
    title: string;
    description: string;
    rating: number;
    createdAt: number;
    updatedAt: number;
    product?: BasicProduct;
}

export type GetUserReviewsResponse = {
    success: true;
    reviews: Review[];
} | {
    success: false;
    error: string;
};
