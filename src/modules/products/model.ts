import { Category } from '../category/model';
import { Review } from '../reviews/model';

export interface Product {
    id: string;
    title: string;
    description: string;
    discount: number | null;
    quantityInStock: number;
    tags: string;
    status: string;
    price: number;
    rating: number;
    category: Category;
    reviews: Review[];
    pictures: Picture[];
}

export interface BasicProduct {
    id: string;
    title: string;
    price: number;
    rating: number;
    picture: Picture;
}

export interface Picture {
    id: string;
    filename: string;
}

export type GetProductResponse = {
    success: true;
    product: Product;
} | {
    success: false;
    error: string;
};

export type SearchProductsResponse = {
    success: true;
    products: Product[];
} | {
    success: false;
    error: string;
};

export type FeaturedProductsResponse = {
    success: true;
    products: {
        consoles: Product[];
        games: Product[];
    };
} | {
    success: false;
    error: string;
};

export interface CreateReviewBody {
    rating: number;
    title: string;
    description: string;
}

export type CreateReviewResponse = {
    success: true;
    product: Product;
} | {
    success: false;
    error: string;
};
