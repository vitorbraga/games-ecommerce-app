import { serverBaseUrl } from '../../utils/api-helper';
import { errorMapper } from '../../utils/messages-mapper';
import { Product, SearchProductsResponse } from './model';

export const searchProducts = async (searchTerm: string): Promise<Product[]> => {
    const response: Response = await fetch(`${serverBaseUrl}/products/search?searchTerm=${searchTerm}`);
    const productsResponse: SearchProductsResponse = await response.json();

    if (productsResponse.success) {
        return productsResponse.products;
    } else {
        throw new Error(errorMapper[productsResponse.error]);
    }
};
