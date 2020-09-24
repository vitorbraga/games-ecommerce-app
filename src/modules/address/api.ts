import { FieldWithError, headersBuilder, serverBaseUrl } from '../../utils/api-helper';
import { getErrorMessage } from '../../utils/messages-mapper';
import { User } from '../user/model';
import * as Model from './model';

export const getUserAddresses = async (userId: string, authToken: string): Promise<Model.Address[]> => {
    // TODO will replace this for using userId from authToken (or comparing both)
    const options = {
        headers: headersBuilder().with('Content-Type', 'application/json').with('Accept', 'application/json').withJwt(authToken).build()
    };

    const response: Response = await fetch(`${serverBaseUrl}/users/${userId}/addresses`, options);
    const addressesResponse: Model.GetUserAddressesResponse = await response.json();

    if (addressesResponse.success) {
        return addressesResponse.addresses;
    } else {
        throw new Error(getErrorMessage(addressesResponse.error));
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
        throw new Error(getErrorMessage(setMainAddressResponse.error));
    }
};

export const createAddress = async (userId: string, address: Model.CreateAddressBody, authToken: string): Promise<User | FieldWithError[]> => {
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
        return createAddressResponse.user;
    } else if ('fields' in createAddressResponse) {
        return createAddressResponse.fields;
    } else {
        throw new Error(getErrorMessage(createAddressResponse.error));
    }
};

export const removeAddress = async (userId: string, addressId: string, authToken: string): Promise<User> => {
    const options = {
        headers: headersBuilder()
            .with('Content-Type', 'application/json')
            .with('Accept', 'application/json')
            .withJwt(authToken)
            .build(),
        method: 'DELETE'
    };

    const response: Response = await fetch(`${serverBaseUrl}/users/${userId}/addresses/${addressId}`, options);
    const removeAddressResponse: Model.RemoveAddressResponse = await response.json();

    if (removeAddressResponse.success) {
        return removeAddressResponse.user;
    } else {
        throw new Error(getErrorMessage(removeAddressResponse.error));
    }
};
