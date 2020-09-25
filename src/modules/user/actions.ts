import { SET_USER_SESSION, ActionTypes, UserSession } from './model';

export function setUserSession(userSession: UserSession | null): ActionTypes {
    return {
        type: SET_USER_SESSION,
        payload: userSession
    };
}
