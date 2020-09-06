import { UserState, User } from './model';

export const userId = (state: UserState): number | null => state.userId;

export const user = (state: UserState): User | null => state.user;

export const userName = (state: UserState): string | null => state.name;
