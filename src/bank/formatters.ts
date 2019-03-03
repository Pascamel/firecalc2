import _ from 'lodash';
import * as I from './interfaces';


export const labelSavings = (saving: string) => {
  const labels = {
    'P': 'Principal',
    'I': 'Interest',
    'T': 'Total'
  };

  return _.get(labels, saving, 'N/A');
}

const formatYear = (months: number[], value?: any) => {
  return _(months).reduce((acc: any, m) => {
    acc[m.toString()] = _.cloneDeep(value || {});
    return acc;
  }, {});
};

export const formatIncome = (income_data: any, headers: any): I.IIncome => {
  let result: I.IIncome = {};
  
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
  let result: I.ISavings = {};
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

export const formatIncomeHeaders = (headers: any) => {
  return _.map(headers.incomes, (h, idx: number) => {
    h.last = (idx === headers.incomes.length - 1);
    return h;
  });
}

export const savingsInputs = (savings: I.ISavingsHeader[], hidden: {}) => {

  // const hidden = filter ? this.savingsHeadersHidden : {}

  // return FinanceHelpers.savingsInputs(this.savingsHeaders, filter ? this.savingsHeadersHidden : {});
  return _(savings)
    .map((header) => {
      let headers: [{id: string, type: string, types: string[]}] = [{
        id: header.id, type: 'P', types: []
      }];
      if (header.interest) _.each(['I', 'T'], (t) => headers.push({id: header.id, type: t, types: []})); 
      _.each(headers, (item) => { 
        _.each(headers, (h) => {
          item.types.push(h.type)
        });
      });
      return headers;
    })
    .flatMap()
    .filter(header => !_.get(hidden, [header.id, header.type], false))
    .value();
}

// const savingsInputs = (savings, hidden) => {
  
// }