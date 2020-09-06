import { SET_USER_ID, SET_USER, ActionTypes, UserState, SET_USER_NAME } from './model';

const initialState: UserState = {
    userId: null,
    user: null,
    name: null
};

export function userReducer(state = initialState, action: ActionTypes): UserState {
    switch (action.type) {
        case SET_USER_ID:
            return {
                ...state,
                userId: action.payload
            };
        case SET_USER:
            return {
                ...state,
                user: action.payload
            };
        case SET_USER_NAME:
            return {
                ...state,
                name: action.payload
            };
        default:
            return state;
    }
}
