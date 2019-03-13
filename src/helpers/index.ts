import moment from 'moment';
import * as ROUTES from '../constants/routes';


const amount = (number: number, display_if_zero: boolean, show_decimals: boolean) => {
  if ((!number || number === 0) && !display_if_zero) return '';

  return Number(number || 0).toLocaleString(
    undefined, { 
      minimumFractionDigits: show_decimals ? 2 : 0,
      maximumFractionDigits: show_decimals ? 2 : 0
    }
  );
};    

const percentage = (number: number) => {
  return Number(100 * number).toFixed(2) + '%';     
};

const goal = (value: number, threshold: number, success?: string, danger?: string) => {
  success = success || 'table-success';
  danger = danger || 'table-danger';
  
  return (value >= threshold) ? success : danger;
};

const roundFloat = (num: number ) => {
  return Math.round((num + 0.00001) * 100) / 100;
};

const showIf = (bool: boolean, className?: string) => {
  className = className || 'hidden';

  return bool ? '' : className;
};

const hideIf = (bool: boolean, className?: string) => {
  className = className || 'hidden';

  return bool ? className : '';
};

const labelMonth = (m: string) => {
  return moment().month(parseInt(m) - 1).format('MMMM');
}

const prevMonth = (year: string, month: string) => {
  let m = parseInt(month);
  let y = parseInt(year);

  m -= 1;
  if (m < 1) {
    m = 12;
    y--;
  }

  return {year: y.toString(), month: m.toString()};
}

const nextMonth = (year: string, month: string) => {
  let m = parseInt(month);
  let y = parseInt(year);

  m += 1;
  if (m > 12) {
    m = 1;
    y++;
  }

  return {year: y.toString(), month: m.toString()};
}

const currentMonthRoute = () => {
  return ROUTES.MONTH
    .replace(':year', (new Date().getFullYear()).toString())
    .replace(':month', (new Date().getMonth() + 1).toString());
}

export default {
  amount, 
  percentage,
  goal,
  roundFloat,
  showIf,
  hideIf,
  labelMonth,
  prevMonth,
  nextMonth,
  currentMonthRoute
};
