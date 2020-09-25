import moment from 'moment';
const DEFAULT_FORMAT = 'LL LT';

export const formatDateFromMilliseconds = (date: number, dateFormat: string = DEFAULT_FORMAT) => {
    const result = moment(date).format(dateFormat);
    return result;
};
