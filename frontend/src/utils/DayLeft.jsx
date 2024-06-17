import moment from 'moment';

export const getDaysLeftInMonth = () => {
    const today = moment();
    const endOfMonth = moment().endOf('month');
    const daysLeft = endOfMonth.diff(today, 'days');
    return daysLeft;
}
