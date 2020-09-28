import { Category } from '../category/model';

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

export interface Review {
    id: string;
    title: string;
    description: string;
    rating: number;
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
