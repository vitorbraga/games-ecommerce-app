import { SET_AUTH_TOKEN, ActionTypes, AuthenticationState } from './model';

const initialState: AuthenticationState = {
    authToken: null
};

export function authenticationReducer(state = initialState, action: ActionTypes): AuthenticationState {
    switch (action.type) {
        case SET_AUTH_TOKEN:
            return {
                authToken: action.payload
            };
        default:
            return state;
    }
}
