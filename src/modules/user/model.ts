export const SET_USER_ID = 'SET_USER_ID';
export const SET_USER_NAME = 'SET_USER_NAME';
export const SET_USER = 'SET_USER';

export interface UserRegister {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
}

export interface UserUpdate {
    firstName: string;
    lastName: string;
}

export interface User {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    role: string;
    createdAt: string;
    updatedAt: string;
}

export interface FieldWithError {
    field: string;
    constraints: {
        [type: string]: string;
    };
}

export type UserRegisterResponse = {
    success: true;
    user: User;
} | {
    success: false;
    fields: FieldWithError[];
} | {
    success: false;
    error: string;
};

export type UserUpdateResponse = UserRegisterResponse;

export type GetUserResponse = {
    success: true;
    user: User;
} | {
    success: false;
    error: string;
};

interface SetUserIdAction { type: typeof SET_USER_ID, payload: number | null }
interface SetUserAction { type: typeof SET_USER, payload: User | null }
interface SetUserNameAction { type: typeof SET_USER_NAME, payload: string | null }

export interface UserState {
    userId: number | null;
    user: User | null;
    name: string | null;
}

export type ActionTypes = SetUserIdAction | SetUserAction | SetUserNameAction;
