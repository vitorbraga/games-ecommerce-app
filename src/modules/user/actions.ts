import { SET_USER_ID, SET_USER, ActionTypes, User, SET_USER_NAME } from './model';

export function setUserId(userId: number | null): ActionTypes {
    return {
        type: SET_USER_ID,
        payload: userId
    };
}

export function setUserName(name: string | null): ActionTypes {
    return {
        type: SET_USER_NAME,
        payload: name
    };
}

export function setUser(user: User | null): ActionTypes {
    return {
        type: SET_USER,
        payload: user
    };
}
