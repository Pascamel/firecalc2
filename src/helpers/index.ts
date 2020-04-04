import moment from 'moment';

import { ISavingsHeader } from '../bank';
import * as ROUTES from '../constants/routes';
import _currentYear from './currentYear';
import _deepCopy from './deepCopy';

export const amount = (
  number: number,
  display_if_zero: boolean,
  show_decimals: boolean
) => {
  if ((!number || number === 0) && !display_if_zero) return '';

  return Number(number || 0).toLocaleString(undefined, {
    minimumFractionDigits: show_decimals ? 2 : 0,
    maximumFractionDigits: show_decimals ? 2 : 0
  });
};

export const percentage = (
  number: number,
  decimals: number = 2,
  plusSign: boolean = false
) => {
  return (
    (plusSign && number >= 0 ? '+' : '') +
    Number(100 * number).toFixed(decimals) +
    '%'
  );
};

export const clean_percentage = (percentage: number) => {
  return Math.min(100, Math.max(0, 100 + 100 * percentage));
};

export const roundFloat = (num: number) => {
  return Math.round((num + 0.00001) * 100) / 100;
};

export const roundUpClosestTen = (num: number) => {
  return Math.ceil(num / 10) * 10;
};

export const labelMonth = (
  m: string,
  y: string = '',
  shortened: boolean = false
) => {
  const month = moment()
    .month(parseInt(m) - 1)
    .format(shortened ? 'MMM' : 'MMMM');

  return y.length < 4 ? month : `${month} ${shortened ? y.slice(-2) : y}`;
};

export const prevMonth = (year: string, month: string) => {
  let m = parseInt(month);
  let y = parseInt(year);

  m -= 1;
  if (m < 1) {
    m = 12;
    y--;
  }

  return { year: y.toString(), month: m.toString() };
};

export const nextMonth = (year: string, month: string) => {
  let m = parseInt(month);
  let y = parseInt(year);

  m += 1;
  if (m > 12) {
    m = 1;
    y++;
  }

  return { year: y.toString(), month: m.toString() };
};

export const currentMonthRoute = () => {
  return ROUTES.MONTH.replace(
    ':year',
    new Date().getFullYear().toString()
  ).replace(':month', (new Date().getMonth() + 1).toString());
};

export const shouldDisplay = (
  object: ISavingsHeader,
  month: number,
  year: number
) => {
  const _trueAndValid = (
    flag: boolean,
    month: number | null,
    year: number | null
  ) => {
    const m = month || 0,
      y = year || 0,
      result = flag && m > 0 && m < 13 && y > 1999 && y < 2099;

    return { result, m, y };
  };

  const { result: from, m: fromMonth, y: fromYear } = _trueAndValid(
      object.displayFrom,
      object.displayFromMonth,
      object.displayFromYear
    ),
    { result: to, m: toMonth, y: toYear } = _trueAndValid(
      object.displayTo,
      object.displayToMonth,
      object.displayToYear
    ),
    f = !from || year > fromYear || (year === fromYear && month >= fromMonth),
    t = !to || year < toYear || (year === toYear && month <= toMonth);

  return f && t;
};

export const currentYear = _currentYear;
export const deepCopy = _deepCopy;
