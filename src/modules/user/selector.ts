import { UserState, UserSession } from './model';

export const getUserSession = (state: UserState): UserSession | null => state.userSession;
