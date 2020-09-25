import jwtDecode from 'jwt-decode';
import { UserSession } from '../user/model';

export interface JwtAuthToken {
    exp: number;
    iat: number;
    userSession: UserSession;
}

export const isAuthenticated = (authToken: string | null): boolean => {
    if (authToken === null) {
        return false;
    }

    const decoded = jwtDecode<JwtAuthToken>(authToken);
    if (decoded.exp * 1000 < Date.now()) {
        return false;
    }

    return true;
};
