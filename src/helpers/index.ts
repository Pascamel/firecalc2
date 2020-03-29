import moment from 'moment';

import { ISavingsHeader } from '../bank';
import * as ROUTES from '../constants/routes';

const amount = (
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

const percentage = (
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

const clean_percentage = (percentage: number) => {
  return Math.min(100, Math.max(0, 100 + 100 * percentage));
};

const goal = (
  value: number,
  threshold: number,
  success?: string,
  danger?: string
) => {
  success = success || 'table-success';
  danger = danger || 'table-danger';

  return value >= threshold ? success : danger;
};

const roundFloat = (num: number) => {
  return Math.round((num + 0.00001) * 100) / 100;
};

const roundUpClosestTen = (num: number) => {
  return Math.ceil(num / 10) * 10;
};

const showIf = (bool: boolean, className?: string) => {
  className = className || 'hidden';

  return bool ? '' : className;
};

const hideIf = (bool: boolean, className?: string) => {
  className = className || 'hidden';

  return bool ? className : '';
};

const labelMonth = (m: string, y: string = '', shortened: boolean = false) => {
  const month = moment()
    .month(parseInt(m) - 1)
    .format(shortened ? 'MMM' : 'MMMM');

  return y.length < 4 ? month : `${month} ${shortened ? y.slice(-2) : y}`;
};

const prevMonth = (year: string, month: string) => {
  let m = parseInt(month);
  let y = parseInt(year);

  m -= 1;
  if (m < 1) {
    m = 12;
    y--;
  }

  return { year: y.toString(), month: m.toString() };
};

const nextMonth = (year: string, month: string) => {
  let m = parseInt(month);
  let y = parseInt(year);

  m += 1;
  if (m > 12) {
    m = 1;
    y++;
  }

  return { year: y.toString(), month: m.toString() };
};

const currentMonthRoute = () => {
  return ROUTES.MONTH.replace(
    ':year',
    new Date().getFullYear().toString()
  ).replace(':month', (new Date().getMonth() + 1).toString());
};

const deepCopy = (data: object) => JSON.parse(JSON.stringify(data));

const shouldDisplay = (object: ISavingsHeader, month: number, year: number) => {
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

export default {
  amount,
  percentage,
  clean_percentage,
  goal,
  roundFloat,
  roundUpClosestTen,
  showIf,
  hideIf,
  labelMonth,
  prevMonth,
  nextMonth,
  currentMonthRoute,
  deepCopy,
  shouldDisplay
};
