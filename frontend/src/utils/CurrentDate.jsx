import moment from 'moment';

export const getCurrentMonth = (format = 'MMMM') => {
    return moment().format(format);
}

export const getCurrentMonthNumber = () => {
    return moment().format('MM'); 
};

export const getCurrentYear = (format = 'YYYY') => {
    return moment().format(format);
};
