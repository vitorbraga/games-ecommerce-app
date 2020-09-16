import { FieldWithError, headersBuilder, serverBaseUrl } from '../../utils/api-helper';
import { errorMapper } from '../../utils/messages-mapper';
import { User } from '../user/model';
import * as Model from './model';

export const getUserAddresses = async (userId: string, authToken: string): Promise<Model.Address[]> => {
    const options = {
        headers: headersBuilder().with('Content-Type', 'application/json').with('Accept', 'application/json').withJwt(authToken).build()
    };

    const response: Response = await fetch(`${serverBaseUrl}/users/${userId}/addresses`, options);
    const addressesResponse: Model.GetUserAddressesResponse = await response.json();

    if (addressesResponse.success) {
        return addressesResponse.addresses;
    } else {
        throw new Error(errorMapper[addressesResponse.error]);
    }
};

export const setMainAddress = async (userId: string, addressId: string, authToken: string): Promise<User> => {
    const options = {
        headers: headersBuilder()
            .with('Content-Type', 'application/json')
            .with('Accept', 'application/json')
            .withJwt(authToken)
            .build(),
        method: 'PATCH'
    };

    const response: Response = await fetch(`${serverBaseUrl}/users/${userId}/addresses/${addressId}`, options);
    const setMainAddressResponse: Model.SetUserMainAddressResponse = await response.json();

    if (setMainAddressResponse.success) {
        return setMainAddressResponse.user;
    } else {
        throw new Error(errorMapper[setMainAddressResponse.error]);
    }
};

export const createAddress = async (userId: string, address: Model.CreateAddressBody, authToken: string): Promise<Model.Address[] | FieldWithError[]> => {
    const options = {
        headers: headersBuilder()
            .with('Content-Type', 'application/json')
            .with('Accept', 'application/json')
            .withJwt(authToken)
            .build(),
        method: 'POST',
        body: JSON.stringify(address)
    };

    const response: Response = await fetch(`${serverBaseUrl}/users/${userId}/addresses`, options);
    const createAddressResponse: Model.CreateAddressResponse = await response.json();

    if (createAddressResponse.success) {
        return createAddressResponse.addresses;
    } else if ('fields' in createAddressResponse) {
        return createAddressResponse.fields;
    } else {
        throw new Error(errorMapper[createAddressResponse.error]);
    }
};
