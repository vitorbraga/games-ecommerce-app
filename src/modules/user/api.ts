import * as Model from './model';
import { FieldWithError, headersBuilder, serverBaseUrl } from '../../utils/api-helper';
import { getErrorMessage } from '../../utils/messages-mapper';

export const registerUser = async (user: Model.UserRegister): Promise<Model.User | FieldWithError[]> => {
    const options = {
        headers: headersBuilder().with('Content-Type', 'application/json').with('Accept', 'application/json').build(),
        method: 'POST',
        body: JSON.stringify(user)
    };

    const response: Response = await fetch(`${serverBaseUrl}/users`, options);
    const userRegisterResponse: Model.UserRegisterResponse = await response.json();

    if (userRegisterResponse.success) {
        return userRegisterResponse.user;
    } else if ('fields' in userRegisterResponse) {
        return userRegisterResponse.fields;
    } else {
        throw new Error(getErrorMessage(userRegisterResponse.error));
    }
};

export const updateUser = async (userId: number, user: Model.UserUpdate, authToken: string): Promise<Model.User | FieldWithError[]> => {
    const options = {
        headers: headersBuilder()
            .with('Content-Type', 'application/json')
            .with('Accept', 'application/json')
            .withJwt(authToken)
            .build(),
        method: 'PATCH',
        body: JSON.stringify(user)
    };

    const response: Response = await fetch(`${serverBaseUrl}/users/${userId}`, options);
    const userUpdateResponse: Model.UserUpdateResponse = await response.json();

    if (userUpdateResponse.success) {
        return userUpdateResponse.user;
    } else if ('fields' in userUpdateResponse) {
        return userUpdateResponse.fields;
    } else {
        throw new Error(getErrorMessage(userUpdateResponse.error));
    }
};

export const getUser = async (userId: string, authToken: string): Promise<Model.User> => {
    const options = {
        headers: headersBuilder().withJwt(authToken).build()
    };

    const response: Response = await fetch(`${serverBaseUrl}/users/${userId}`, options);
    const userResponse: Model.GetUserResponse = await response.json();

    if (userResponse.success) {
        return userResponse.user;
    } else {
        throw new Error(getErrorMessage(userResponse.error));
    }
};

export const getUserFullData = async (userId: string, authToken: string): Promise<Model.User> => {
    const options = {
        headers: headersBuilder().withJwt(authToken).build()
    };

    const response: Response = await fetch(`${serverBaseUrl}/users/${userId}/full`, options);
    const userResponse: Model.GetUserResponse = await response.json();

    if (userResponse.success) {
        return userResponse.user;
    } else {
        throw new Error(getErrorMessage(userResponse.error));
    }
};

export const changePassword = async (userId: string, currentPassword: string, newPassword: string, authToken: string): Promise<Model.User> => {
    const options = {
        headers: headersBuilder().withJwt(authToken).build(),
        method: 'PATCH',
        body: JSON.stringify({ currentPassword, newPassword })
    };

    const response = await fetch(`${serverBaseUrl}/users/${userId}/password`, options);
    const changePasswordResponse: Model.ChangePasswordResponse = await response.json();

    if (changePasswordResponse.success) {
        return changePasswordResponse.user;
    } else {
        throw new Error(getErrorMessage(changePasswordResponse.error));
    }
};
