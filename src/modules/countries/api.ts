import { headersBuilder, serverBaseUrl } from '../../utils/api-helper';
import { errorMapper } from '../../utils/messages-mapper';
import * as Model from './model';

export const getAllCountries = async (): Promise<Model.Country[]> => {
    const options = {
        headers: headersBuilder().with('Content-Type', 'application/json').with('Accept', 'application/json').build()
    };

    const response: Response = await fetch(`${serverBaseUrl}/countries`, options);
    const countriesResponse: Model.GetAllCountriesResponse = await response.json();

    if (countriesResponse.success) {
        return countriesResponse.countries;
    } else {
        throw new Error(errorMapper[countriesResponse.error]);
    }
};
