import { UserRegister, UserRegisterResponse, GetUserResponse, UserUpdate, UserUpdateResponse, User } from './model';
import { FieldWithError, headersBuilder, serverBaseUrl } from '../../utils/api-helper';
import { errorMapper } from '../../utils/messages-mapper';

export const registerUser = async (user: UserRegister): Promise<User | FieldWithError[]> => {
    const options = {
        headers: headersBuilder().with('Content-Type', 'application/json').with('Accept', 'application/json').build(),
        method: 'POST',
        body: JSON.stringify(user)
    };

    const response: Response = await fetch(`${serverBaseUrl}/users`, options);
    const userRegisterResponse: UserRegisterResponse = await response.json();

    if (userRegisterResponse.success) {
        return userRegisterResponse.user;
    } else if ('fields' in userRegisterResponse) {
        return userRegisterResponse.fields;
    } else {
        throw new Error(errorMapper[userRegisterResponse.error]);
    }
};

export const updateUser = async (userId: number, user: UserUpdate, authToken: string): Promise<User | FieldWithError[]> => {
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
    const userUpdateResponse: UserUpdateResponse = await response.json();

    if (userUpdateResponse.success) {
        return userUpdateResponse.user;
    } else if ('fields' in userUpdateResponse) {
        return userUpdateResponse.fields;
    } else {
        throw new Error(errorMapper[userUpdateResponse.error]);
    }
};

export const getUser = async (userId: number, authToken: string): Promise<User> => {
    const options = {
        headers: headersBuilder().withJwt(authToken).build()
    };

    const response: Response = await fetch(`${serverBaseUrl}/users/${userId}`, options);
    const userResponse: GetUserResponse = await response.json();

    if (userResponse.success) {
        return userResponse.user;
    } else {
        throw new Error(errorMapper[userResponse.error]);
    }
};
