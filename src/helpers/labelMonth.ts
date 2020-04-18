import moment from 'moment';

const labelMonth = (m: string, y: string = '', shortened: boolean = false) => {
  if (m.length === 0) return 'Unknown';

  const month = moment()
    .month(parseInt(m) - 1)
    .format(shortened ? 'MMM' : 'MMMM');

  return y.length < 4 ? month : `${month} ${shortened ? y.slice(-2) : y}`;
};

export default labelMonth;
