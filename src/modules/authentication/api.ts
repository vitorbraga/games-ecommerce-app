import * as Model from './model';
import { headersBuilder, serverBaseUrl } from '../../utils/api-helper';
import { getErrorMessage } from '../../utils/messages-mapper';

export const authenticate = async (username: string, password: string): Promise<string> => {
    const options = {
        headers: headersBuilder().with('Content-Type', 'application/json').with('Accept', 'application/json').build(),
        method: 'POST',
        body: JSON.stringify({ username, password })
    };

    const response: Response = await fetch(`${serverBaseUrl}/auth/login`, options);
    const loginResponse: Model.LoginResponse = await response.json();

    if (loginResponse.success) {
        return loginResponse.jwt;
    } else {
        throw new Error(getErrorMessage(loginResponse.error));
    }
};

export const passwordRecovery = async (email: string): Promise<void> => {
    const options = {
        headers: headersBuilder().with('Content-Type', 'application/json').with('Accept', 'application/json').build(),
        method: 'POST',
        body: JSON.stringify({ email })
    };

    const response: Response = await fetch(`${serverBaseUrl}/auth/password-recovery`, options);
    const passwordRecoveryResponse: Model.PasswordRecoveryResponse = await response.json();

    if (!passwordRecoveryResponse.success) {
        throw new Error(getErrorMessage(passwordRecoveryResponse.error));
    }
};

export const resetPasswordWithToken = async (newPassword: string, token: string, userId: string): Promise<void> => {
    const options = {
        headers: headersBuilder().with('Content-Type', 'application/json').with('Accept', 'application/json').build(),
        method: 'POST',
        body: JSON.stringify({ newPassword, token, userId })
    };

    const response: Response = await fetch(`${serverBaseUrl}/auth/reset-password`, options);
    const resetPasswordResponse: Model.ResetPasswordTokenResponse = await response.json();

    if (!resetPasswordResponse.success) {
        throw new Error(getErrorMessage(resetPasswordResponse.error));
    }
};

export const checkValidPasswordResetToken = async (token: string, userId: string): Promise<void> => {
    const options = {
        headers: headersBuilder().with('Content-Type', 'application/json').with('Accept', 'application/json').build()
    };

    const response = await fetch(`${serverBaseUrl}/auth/check-password-token?token=${token}&userId=${userId}`, options);
    const checkPasswordResponse: Model.CheckPasswordTokenResponse = await response.json();

    if (!checkPasswordResponse.success) {
        throw new Error(getErrorMessage(checkPasswordResponse.error));
    }
};
