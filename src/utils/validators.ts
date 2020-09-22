function hasNumber(value: string) {
    return /\d/.test(value);
}

export const CREDIT_CARD_MASK = [/\d/, /\d/, /\d/, /\d/, ' ', /\d/, /\d/, /\d/, /\d/, ' ', /\d/, /\d/, /\d/, /\d/, ' ', /\d/, /\d/, /\d/, /\d/];
export const EXPIRATION_DATE_MASK = [/\d/, /\d/, '/', /\d/, /\d/, /\d/, /\d/];
const creditCardNumberRegex = /(\d{4} *\d{4} *\d{4} *\d{4})/;

export const checkPasswordComplexity = (password: string | undefined | null): boolean => {
    return password !== null && password !== undefined && password.length >= 6 && hasNumber(password);
};

export const validateCreditCartExpirationDate = (expirationDate: string | undefined | null): boolean => {
    if (!expirationDate) {
        return false;
    }

    const today = new Date();
    const monthToday = today.getMonth() + 1;
    const yearToday = today.getFullYear().toString();

    const [expMonth, expYear] = expirationDate.split('/');

    if (Number(expYear) < Number(yearToday)) {
        return false;
    } else if (Number(expMonth) < monthToday && Number(expYear) <= Number(yearToday)) {
        return false;
    }

    return true;
};

export const validateCreditCartExpirationMonth = (expirationDate: string | undefined | null): boolean => {
    if (!expirationDate) {
        return false;
    }

    const [expMonth] = expirationDate.split('/');

    if (Number(expMonth) > 12) {
        return false;
    }

    return true;
};

export const validateCreditCardNumber = (creditCardNumber: string | undefined | null): boolean => {
    if (!creditCardNumber) {
        return false;
    }

    return !!creditCardNumber.match(creditCardNumberRegex);
};
