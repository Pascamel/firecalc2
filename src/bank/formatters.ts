import _ from 'lodash';
import { IIncome, ISavings } from './interfaces';


const formatYear = (months: number[], value?: any) => {
  return _(months).reduce((acc: any, m) => {
    acc[m.toString()] = _.cloneDeep(value || {});
    return acc;
  }, {});
};

export const formatIncome = (income_data: any, headers: any): IIncome => {
  let result: IIncome = {};
  
  let years = _.range(headers.firstYear, new Date().getFullYear() + 1);

  _(years).each((y, idx) => {
    if (idx === 0 && years.length === 1) {
      result[y] = formatYear(_.range(headers.firstMonth, new Date().getMonth() + 2), {});
    } else if (idx === 0) {
      result[y] = formatYear(_.range(headers.firstMonth, 13), {});
    } else {
      result[y] = formatYear(_.range(1, 13), {});
    }
  });

  _(income_data).each((d) => {
    _.set(result, [d.year, d.month, d.type], d.amount);
  });

  return result;
}

export const formatSavings = (data: any, headers: any) => {
  let result: ISavings = {};
  let years = _.range(headers.firstYear, new Date().getFullYear() + 1);

  _(years).each((y, idx) => {
    if (idx === 0 && years.length === 1) {
      result[y] = formatYear(_.range(headers.firstMonth, new Date().getMonth() + 2));
    } else if (idx === 0) {
      result[y] = formatYear(_.range(headers.firstMonth, 13));
    } else {
      result[y] = formatYear(_.range(1, 13));
    }
  });

  _(data).each((d) => {
    _.set(result, [d.year, d.month, d.institution, d.type], d.amount);
  });

  return result;
}