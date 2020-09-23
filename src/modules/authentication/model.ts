import { User } from '../user/model';

export const SET_AUTH_TOKEN = 'SET_AUTH_TOKEN';
export const USER_LOGOUT = 'USER_LOGOUT';

export type LoginResponse = {
    success: true;
    jwt: string;
} | {
    success: false;
    error: string;
};

export type BaseResponse = {
    success: true;
} | {
    success: false;
    error: string;
};

// TODO maybe try to create a common typescript type for these responses
export type ChangePasswordResponse = {
    success: true;
    user: User;
} | {
    success: false;
    error: string;
};

export type PasswordRecoveryResponse = BaseResponse;

export type ChangePasswordTokenResponse = BaseResponse;

export type CheckPasswordTokenResponse = BaseResponse;

interface SetAuthTokenAction {
    type: typeof SET_AUTH_TOKEN;
    payload: string | null;
}

interface UserLogoutAction {
    type: typeof USER_LOGOUT;
}

export interface AuthenticationState {
    authToken: string | null;
}

export type ActionTypes = SetAuthTokenAction | UserLogoutAction;
