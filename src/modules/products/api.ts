import { serverBaseUrl } from '../../utils/api-helper';
import { errorMapper } from '../../utils/messages-mapper';
import * as Model from './model';

export const searchProducts = async (searchTerm: string): Promise<Model.Product[]> => {
    const response: Response = await fetch(`${serverBaseUrl}/products/search?searchTerm=${searchTerm}`);
    const productsResponse: Model.SearchProductsResponse = await response.json();

    if (productsResponse.success) {
        return productsResponse.products;
    } else {
        throw new Error(errorMapper[productsResponse.error]);
    }
};

export const getFeaturedProducts = async (): Promise<Model.Product[]> => {
    const response: Response = await fetch(`${serverBaseUrl}/products/featured`);
    const productsResponse: Model.FeaturedProductsResponse = await response.json();

    if (productsResponse.success) {
        return productsResponse.products;
    } else {
        throw new Error(errorMapper[productsResponse.error]);
    }
};

export const getProduct = async (productId: string): Promise<Model.Product> => {
    const response: Response = await fetch(`${serverBaseUrl}/products/${productId}`);
    const productResponse: Model.GetProductResponse = await response.json();

    if (productResponse.success) {
        return productResponse.product;
    } else {
        throw new Error(errorMapper[productResponse.error]);
    }
};
