import { SET_AUTH_TOKEN, USER_LOGOUT, ActionTypes } from './model';

export function setAuthToken(authToken: string | null): ActionTypes {
    return {
        type: SET_AUTH_TOKEN,
        payload: authToken
    };
}

export function userLogout(): ActionTypes {
    return {
        type: USER_LOGOUT
    };
}
