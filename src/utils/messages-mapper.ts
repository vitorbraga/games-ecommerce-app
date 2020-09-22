export interface UserMessage {
    [Key: string]: string;
}

export const errorMapper: UserMessage = {
    LOGIN_MISSING_CREDENTIALS: 'Missing credentials.',
    LOGIN_USER_NOT_FOUND: 'User not found.',
    LOGIN_UNMATCHED_EMAIL_PWD: 'Email and password do not match.',
    LOGIN_ENTER_EMAIL_PWD: 'Please enter your email and password.',
    LOGIN_ADMIN_USER_NOT_FOUND: 'Admin user not found.',
    REGISTER_REQUIRED_FIELD: 'This field is required.',
    REGISTER_INVALID_EMAIL: 'Invalid email.',
    REGISTER_EMAIL_IN_USE: 'Email address already in use.',
    REGISTER_PASSWORD_COMPLEXITY: 'Password must be at least 6 characters and it must contain numbers and letters.',
    REGISTER_TERMS_AGREEMENT: 'You must agree to our Terms of Service.',
    REGISTER_PASSWORD_SIX_CHARS: 'Password must have at least 6 characters.',
    USER_NOT_FOUND: 'User not found.',
    PASSWORD_RESET_MISSING_EMAIL: 'Please provide an email.',
    PASSWORD_RESET_USER_NOT_FOUND: 'We could not find a user with the provided email.',
    PASSWORD_RESET_REQUIRED_FIELDS: 'Required fields.',
    PASSWORDS_DO_NOT_MATCH: 'Passwords do not match.',
    PASSWORD_TOKEN_REQUIRED: 'Password token is required.', // TODO fix this message
    PASSWORD_USER_ID_REQUIRED: 'Password user id required', // TODO fix this message
    PASSWORD_TOKEN_EXPIRED: 'Password token expired',
    EMAIL_INVALID: 'Email address is invalid. Please enter a valid email address.',
    PASSWORD_RESET_BAD_USER_ID: 'Invalid user ID.',
    PASSWORD_RESET_TOKEN_AND_ID_NOT_MATCH: 'Token and user ID do not match.', // TODO fix this message
    PASSWORD_RESET_MISSING_TOKEN_USERID: 'Missing token and/or user ID.',
    PASSWORD_RESET_TOKEN_USER_NOT_FOUND: 'We could not find a user with the provided token.',
    PASSWORD_RESET_ONGOING_RECOVERY_PROCESS: 'There is an ongoing password recovery process. You can start a new password recovery process each 5 hours.',
    PROFILE_ERROR_FETCHING_USER_DATA: 'Error fetching user data. Please try again.',
    UPDATE_USER_NOT_FOUND: 'User not found.',
    UPDATE_REQUIRED_FIELD: 'This field is required.',
    CHANGE_PASSWORD_REQUIRED_FIELDS: 'Required fields.',
    CHANGE_PASSWORD_MISSING_PASSWORDS: 'Missing passwords.',
    CHANGE_PASSWORD_USER_NOT_FOUND: 'User not found.',
    CHANGE_PASSWORD_INCORRECT_CURRENT_PASSWORD: 'Current password is incorrect.',
    CHANGE_PASSWORD_PASSWORD_COMPLEXITY: 'Password must be at least 6 characters and it must contain numbers and letters.'
};

export const successMapper: UserMessage = {
    USER_UPDATED: 'User information updated successfully.',
    PASSWORD_RESET_EMAIL_SENT: 'We sent a password reset link to your email address, which allows you to reset your password.'
};
