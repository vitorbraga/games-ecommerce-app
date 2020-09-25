import { SET_USER_SESSION, ActionTypes, UserState } from './model';

const initialState: UserState = {
    userSession: null
};

export function userReducer(state = initialState, action: ActionTypes): UserState {
    switch (action.type) {
        case SET_USER_SESSION:
            return {
                ...state,
                userSession: action.payload
            };
        default:
            return state;
    }
}
