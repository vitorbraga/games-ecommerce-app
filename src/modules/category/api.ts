import { serverBaseUrl } from '../../utils/api-helper';
import { getErrorMessage } from '../../utils/messages-mapper';
import * as Model from './model';

export const getFullTreeOfCategories = async (): Promise<Model.Category[]> => {
    const response: Response = await fetch(`${serverBaseUrl}/categories`);
    const categoriesResponse: Model.GetFullTreeOfCategoriesResponse = await response.json();

    if (categoriesResponse.success) {
        return categoriesResponse.categories;
    } else {
        throw new Error(getErrorMessage(categoriesResponse.error));
    }
};
