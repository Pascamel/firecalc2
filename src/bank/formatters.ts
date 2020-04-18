import _ from 'lodash';

import * as I from './interfaces';

export const labelSavings = (saving: string) => {
  const labels = {
    P: 'Principal',
    I: 'Interest',
    T: 'Total',
  };

  return _.get(labels, saving, 'N/A');
};

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
      result[y] = formatYear(
        _.range(headers.firstMonth, new Date().getMonth() + 2),
        {}
      );
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
};

export const formatSavings = (data: any, headers: any) => {
  let result: I.ISavings = {};
  let years = _.range(headers.firstYear, new Date().getFullYear() + 1);

  _(years).each((y, idx) => {
    if (idx === 0 && years.length === 1) {
      result[y] = formatYear(
        _.range(headers.firstMonth, new Date().getMonth() + 2)
      );
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
};

export const formatExpenses = (data: any, headers: any) => {
  let result: I.IExpenses = {};
  let years = _.range(headers.firstYear, new Date().getFullYear() + 1);

  _(years).each((y, idx) => {
    if (idx === 0 && years.length === 1) {
      result[y] = formatYear(
        _.range(headers.firstMonth, new Date().getMonth() + 2)
      );
    } else if (idx === 0) {
      result[y] = formatYear(_.range(headers.firstMonth, 13));
    } else {
      result[y] = formatYear(_.range(1, 13));
    }
  });

  _(data).each((d) => {
    _.set(result, [d.year, d.month, d.type], d.amount);
  });

  return result;
};

export const formatIncomeHeaders = (headers: {
  incomes: I.IIncomeHeader[];
}) => {
  return _.map(headers.incomes, (h, idx: number) => {
    h.last = idx === headers.incomes.length - 1;
    return h;
  });
};

export const formatSavingsHeaders = (headers: {
  savings: I.ISavingsHeader[];
}) => {
  return headers.savings;
};

export const formatExpensesHeaders = (headers: {
  expenses: I.IExpenseHeader[];
}) => {
  return headers.expenses;
};

export const savingsInputs = (savings: I.ISavingsHeader[], hidden: {}) => {
  return _(savings)
    .map((header) => {
      let headers: [{ id: string; type: string; types: string[] }] = [
        {
          id: header.id,
          type: 'P',
          types: [],
        },
      ];
      if (header.interest)
        _.each(['I', 'T'], (t) =>
          headers.push({ id: header.id, type: t, types: [] })
        );
      _.each(headers, (item) => {
        _.each(headers, (h) => {
          item.types.push(h.type);
        });
      });
      return headers;
    })
    .flatMap()
    .filter((header) => !_.get(hidden, [header.id, header.type], false))
    .value();
};

const hashHiddenColumns = (hidden: any) => {
  return _(hidden).reduce((acc: { [key: string]: number }, value, key) => {
    const c = _.reduce(value, (acc, v) => acc + (v ? 1 : 0), 0);
    if (c > 0) acc[key] = c;
    return acc;
  }, {});
};

export const savingsHeadersLine1 = (
  savings: I.ISavingsHeader[],
  hidden: {}
) => {
  const h = hashHiddenColumns(hidden);

  return _(savings)
    .map((header) => {
      return {
        label: header.label,
        icon: header.icon,
        weight: (header.interest ? 3 : 1) - _.get(h, header.id, 0),
      };
    })
    .filter((header) => header.weight > 0)
    .groupBy('label')
    .map((header, key) => {
      return {
        label: key,
        icon: header[0].icon,
        weight: _.reduce(header, (sum, h) => sum + h.weight, 0),
      };
    })
    .value();
};

export const savingsHeadersLine2 = (
  savings: I.ISavingsHeader[],
  hidden: {}
) => {
  return _(savings)
    .map((header) => {
      let headers = [];

      if (!_.get(hidden, [header.id, 'P'], false))
        headers.push(header.sublabel || labelSavings('P'));

      if (header.interest) {
        _.each(['I', 'T'], (t) => {
          if (!_.get(hidden, [header.id, t], false))
            headers.push(labelSavings(t));
        });
      }

      headers = _.map(headers, (h, idx) => {
        return {
          label: h,
          last: idx === headers.length - 1,
        };
      });
      return headers;
    })
    .flatMap()
    .value();
};

export const formatSavingstaToSave = (savings: I.ISavings) => {
  let data: any[] = [];

  _.each(savings, (data_year, year) => {
    _.each(data_year, (data_month, month) => {
      _.each(data_month, (data_institution, institution) => {
        _.each(data_institution, (amount, type) => {
          if (type === 'T') return;
          if (amount === 0) return;

          data.push({
            year: parseInt(year),
            month: parseInt(month),
            institution: institution,
            type: type,
            amount: amount,
          });
        });
      });
    });
  });

  return data;
};

export const formatIncomeToSave = (income: I.IIncome) => {
  let data: any[] = [];

  _.each(income, (data_year, year) => {
    _.each(data_year, (data_month, month) => {
      _.each(data_month, (amount, institution) => {
        if (amount === 0) return;

        data.push({
          year: parseInt(year),
          month: parseInt(month),
          type: institution,
          amount: amount,
        });
      });
    });
  });

  return data;
};

export const formatExpensesToSave = (expenses: I.IExpenses) => {
  let data: any[] = [];

  _.each(expenses, (data_year, year) => {
    _.each(data_year, (data_month, month) => {
      _.each(data_month, (amount, type) => {
        if (amount === 0) return;

        data.push({
          year: parseInt(year),
          month: parseInt(month),
          type: type,
          amount: amount,
        });
      });
    });
  });

  return data;
};
