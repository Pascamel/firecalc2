import _ from 'lodash';
import moment from 'moment';

import { firestore } from '../firebase';
import { deepCopy, prevMonth } from '../helpers';
import * as formatters from './formatters';
import * as I from './interfaces';

export interface IBank {
  showDecimals: boolean;
  savingsHeadersHidden: I.IBankInstitutionTypeBoolean;

  lastupdate: { [type: string]: string };
  headers: any;
  firstYear: number;
  firstMonth: number;
  startingCapital: number;

  income: I.IIncome;
  savings: I.ISavings;
  expenses: I.IExpenses;
  networth: I.IBankYearMonthString;
  notes: I.IBankYearMonthString;
  savingsInputs: Array<I.ISavingsHeaderLight>;
  savingsInputsHidden: Array<I.ISavingsHeaderLight>;

  incomeHeaders: Array<I.IIncomeHeader>;
  savingsHeaders: Array<I.ISavingsHeader>;
  incomeYearHeaders: I.IIncomeYearHeaders;
  expensesHeaders: Array<I.IExpenseHeader>;
  savingsYearHeaders: I.ISavingsYearHeaders;
  savingsHeadersLine1: Array<{ label: string; icon: string; weight: number }>;
  savingsHeadersLine2: Array<{ label: string; last: boolean }>;

  startOfYearAmount: I.IBankYearAmount;
  totalMonthSavings: I.IBankYearMonthAmount;
  totalHolding: I.IBankYearMonthAmount;
  goalMonth: I.IBankYearMonthAmount;
  goalYearToDate: I.IBankYearMonthAmount;
  totalInstitution: I.IBankYearInstitutionTypeAmount;
  totalMonthInstitution: I.IBankYearMonthInstitutionAmount;
  grandTotalMonthInstitution: I.IBankYearMonthInstitutionAmount;
  monthlyGoal: I.IBankYearAmount;
  grandTotalInstitution: I.IBankInstitutionTypeNumber;
  grandTotalHolding: number;

  totalMonthPre: I.IBankYearMonthAmount;
  totalMonthPost: I.IBankYearMonthAmount;
  totalMonthIncome: I.IBankYearMonthAmount;
  totalYearPre: I.IBankYearAmount;
  totalYearPost: I.IBankYearAmount;
  yearlyIncome: I.IBankYearInstitutionAmount;
  savingRateMonth: I.IBankYearMonthAmount;
  savingRateYear: I.IBankYearMonthAmount;
}

export const load = async (uid: string): Promise<IBank> => {
  let bank: IBank = {} as IBank;

  loadLocalStorage1(bank);
  const snapshotHeaders = await firestore.getHeaders(uid);
  const snapshotSavings = await firestore.getSavings(uid);
  const snapshotRevenues = await firestore.getRevenues(uid);
  const snapshotExpenses = await firestore.getExpenses(uid);
  const snapshotOthers = await firestore.getOthers(uid);

  if (
    !snapshotHeaders ||
    !snapshotSavings ||
    !snapshotRevenues ||
    !snapshotExpenses ||
    !snapshotOthers
  ) {
    return bank;
  }

  bank.lastupdate = {};

  const headersLastUpdate = snapshotHeaders.data()?.last_update;
  const savingsLastUpdate = snapshotSavings.data()?.last_update;
  const revenuesLastUpdate = snapshotRevenues.data()?.last_update;
  const expensesLastUpdate = snapshotExpenses.data()?.last_update;
  const othersLastUpdate = snapshotOthers.data()?.last_update;

  if (headersLastUpdate) {
    bank.lastupdate['headers'] = moment(headersLastUpdate).fromNow();
  }
  if (savingsLastUpdate) {
    bank.lastupdate['savings'] = moment(savingsLastUpdate).fromNow();
  }
  if (revenuesLastUpdate) {
    bank.lastupdate['income'] = moment(revenuesLastUpdate).fromNow();
  }
  if (expensesLastUpdate) {
    bank.lastupdate['expenses'] = moment(expensesLastUpdate).fromNow();
  }
  if (othersLastUpdate) {
    bank.lastupdate['others'] = moment(othersLastUpdate).fromNow();
  }

  bank.headers = snapshotHeaders.data() ?? [];
  let savings_data = _.get(snapshotSavings.data(), 'data', []);
  let revenues_data = _.get(snapshotRevenues.data(), 'data', []);
  let expenses_data = _.get(snapshotExpenses.data(), 'data', []);

  bank.incomeYearHeaders = { collapsed: {} };
  bank.savingsYearHeaders = _.get(snapshotSavings.data(), 'yearly_data', {
    collapsed: {},
    goals: {},
  });

  bank.income = formatters.formatIncome(revenues_data, bank.headers);
  bank.savings = formatters.formatSavings(savings_data, bank.headers);
  bank.expenses = formatters.formatExpenses(expenses_data, bank.headers);
  bank.networth = _.get(snapshotOthers.data(), 'networth', {});
  bank.notes = _.get(snapshotOthers.data(), 'notes', {});

  formatHeaders(bank);
  loadLocalStorage2(bank);
  calculateTotals(bank);

  return bank;
};

export const formatHeaders = (bank: IBank) => {
  if ((bank.headers.incomes?.length ?? 0) === 0) {
    bank.headers.incomes = [];
  }
  if ((bank.headers.savings?.length ?? 0) === 0) {
    bank.headers.savings = [];
  }
  if ((bank.headers.expenses?.length ?? 0) === 0) {
    bank.headers.expenses = [];
  }

  bank.incomeHeaders = formatters.formatIncomeHeaders(bank.headers);
  bank.savingsHeaders = formatters.formatSavingsHeaders(bank.headers);
  bank.expensesHeaders = formatters.formatExpensesHeaders(bank.headers);

  bank.savingsInputs = formatters.savingsInputs(bank.savingsHeaders, {});
  bank.savingsInputsHidden = formatters.savingsInputs(
    bank.savingsHeaders,
    bank.savingsHeadersHidden
  );

  bank.savingsHeadersLine1 = formatters.savingsHeadersLine1(
    bank.savingsHeaders,
    bank.savingsHeadersHidden
  );
  bank.savingsHeadersLine2 = formatters.savingsHeadersLine2(
    bank.savingsHeaders,
    bank.savingsHeadersHidden
  );
};

export const loadLocalStorage1 = (bank: IBank) => {
  if (!bank.savingsHeadersHidden) bank.savingsHeadersHidden = {};
  _.each(
    JSON.parse(localStorage.getItem('savings_hidden') || '{}'),
    (value, key) => {
      if (!bank.savingsHeadersHidden[key]) bank.savingsHeadersHidden[key] = {};
      _.each(value, (v, t) => {
        bank.savingsHeadersHidden[key][t] = v;
      });
    }
  );
};

export const loadLocalStorage2 = (bank: IBank) => {
  if (!bank.savingsYearHeaders.collapsed)
    bank.savingsYearHeaders.collapsed = {};
  _.each(
    JSON.parse(localStorage.getItem('savings_collapsed') || '{}'),
    (value, key) => {
      bank.savingsYearHeaders.collapsed[key] = value;
    }
  );

  if (!bank.incomeYearHeaders.collapsed) bank.incomeYearHeaders.collapsed = {};
  _.each(
    JSON.parse(localStorage.getItem('income_collapsed') || '{}'),
    (value, key) => {
      bank.incomeYearHeaders.collapsed[key] = value;
    }
  );

  bank.showDecimals =
    parseInt(localStorage.getItem('show_decimals') || '1') > 0;
};

export const updateValue = (
  bank: IBank,
  index: string,
  indexes: string[],
  value: number | boolean
) => {
  if (indexes.length > 0) {
    _.set(bank, _.concat([index], indexes), value);
  } else {
    _.set(bank, [index], value);
  }
};

export const saveLocalStorage = (bank: IBank) => {
  localStorage.setItem(
    'savings_collapsed',
    JSON.stringify(bank.savingsYearHeaders.collapsed)
  );
  localStorage.setItem(
    'income_collapsed',
    JSON.stringify(bank.incomeYearHeaders.collapsed)
  );
  localStorage.setItem('show_decimals', bank.showDecimals ? '1' : '0');
  localStorage.setItem(
    'savings_hidden',
    JSON.stringify(bank.savingsHeadersHidden)
  );
};

export const saveHeaders = async (uid: string, bank: IBank) => {
  const data = deepCopy(bank.headers);
  data.last_update = new Date().getTime();

  try {
    await firestore.setHeaders(uid, data);
    return true;
  } catch {
    return false;
  }
};

export const saveIncome = async (uid: string, bank: IBank) => {
  const payload = {
    last_update: new Date().getTime(),
    data: JSON.parse(
      JSON.stringify(formatters.formatIncomeToSave(bank.income))
    ),
    yearly_data: deepCopy(bank.incomeYearHeaders),
  };

  try {
    await firestore.setRevenues(uid, payload);
    return true;
  } catch {
    return false;
  }
};

export const saveSavings = async (uid: string, bank: IBank) => {
  const payload = {
    last_update: new Date().getTime(),
    data: JSON.parse(
      JSON.stringify(formatters.formatSavingstaToSave(bank.savings))
    ),
    yearly_data: deepCopy(bank.savingsYearHeaders),
    hideDecimals: !bank.showDecimals,
  };

  try {
    await firestore.setSavings(uid, payload);
    return true;
  } catch {
    return false;
  }
};

export const saveExpenses = async (uid: string, bank: IBank) => {
  const payload = {
    last_update: new Date().getTime(),
    data: JSON.parse(
      JSON.stringify(formatters.formatExpensesToSave(bank.expenses))
    ),
  };

  try {
    await firestore.setExpenses(uid, payload);
    return true;
  } catch {
    return false;
  }
};

export const saveOthers = async (uid: string, bank: IBank) => {
  const payload = {
    last_update: new Date().getTime(),
    networth: deepCopy(bank.networth),
    notes: deepCopy(bank.notes),
  };

  try {
    await firestore.setOthers(uid, payload);
    return true;
  } catch {
    return false;
  }
};

export const calculateTotals = (bank: IBank) => {
  bank.startOfYearAmount = {};
  bank.totalMonthSavings = {};
  bank.totalHolding = {};
  bank.goalMonth = {};
  bank.goalYearToDate = {};
  bank.totalInstitution = {};
  bank.totalMonthInstitution = {};
  bank.grandTotalMonthInstitution = {};
  bank.monthlyGoal = {};
  bank.grandTotalInstitution = {};

  bank.totalMonthPre = {};
  bank.totalMonthPost = {};
  bank.totalMonthIncome = {};
  bank.totalYearPre = {};
  bank.totalYearPost = {};
  bank.yearlyIncome = {};
  bank.savingRateMonth = {};
  bank.savingRateYear = {};

  _.each(bank.savings, (year_data, year) => {
    bank.totalMonthSavings[year] = {};
    bank.totalHolding[year] = {};
    bank.goalMonth[year] = {};
    bank.goalYearToDate[year] = {};
    bank.totalInstitution[year] = {};
    bank.totalMonthInstitution[year] = {};
    bank.grandTotalMonthInstitution[year] = {};
    bank.totalMonthPre[year] = {};
    bank.totalMonthPost[year] = {};
    bank.totalMonthIncome[year] = {};
    bank.yearlyIncome[year] = {};
    bank.savingRateMonth[year] = {};
    bank.savingRateYear[year] = {};
    if (!bank.networth[year]) bank.networth[year] = {};

    bank.startOfYearAmount[year] =
      year === bank.headers.firstYear.toString()
        ? parseFloat(bank.headers.startingCapital)
        : _.get(bank.totalHolding, [parseInt(year) - 1, '12'], 0);
    const goal_year = _.get(bank.savingsYearHeaders, ['goals', year], 0);
    bank.monthlyGoal[year] =
      (goal_year - bank.startOfYearAmount[year]) /
      _.keys(bank.savings[year]).length;

    //totalInstitution
    _.each(bank.savingsInputs, (header) => {
      if (!bank.totalInstitution[year][header.id])
        bank.totalInstitution[year][header.id] = {};
      if (header.type === 'T') {
        bank.totalInstitution[year][header.id][header.type] = _.reduce(
          ['P', 'I'],
          (acc, t) => acc + bank.totalInstitution[year][header.id][t],
          0
        );
      } else {
        bank.totalInstitution[year][header.id][header.type] = _.reduce(
          bank.savings[year],
          (v, i) => v + _.get(i, [header.id, header.type], 0),
          0
        );
      }
    });

    bank.totalYearPre[year] = 0;
    bank.totalYearPost[year] = 0;
    _.each(bank.incomeHeaders, (header) => {
      bank.yearlyIncome[year][header.id] = 0;
    });

    _.each(year_data, (month_data, month) => {
      // totalMonthSavings
      bank.totalMonthSavings[year][month] = _.reduce(
        month_data,
        (acc: number, v) => {
          return acc + _.get(v, 'P', 0) + _.get(v, 'I', 0);
        },
        0
      );

      // totalHolding
      if (
        month === bank.headers.firstMonth.toString() &&
        year === bank.headers.firstYear.toString()
      ) {
        bank.totalHolding[year][month] =
          parseFloat(bank.headers.startingCapital) +
          bank.totalMonthSavings[year][month];
      } else {
        const { year: pyear, month: pmonth } = prevMonth(year, month);
        bank.totalHolding[year][month] =
          bank.totalHolding[pyear][pmonth] +
          bank.totalMonthSavings[year][month];
      }

      // goalMonth
      const goal =
        (goal_year - bank.startOfYearAmount[year]) /
        _.keys(bank.savings[year]).length;
      bank.goalMonth[year][month] =
        bank.totalMonthSavings[year][month] - bank.monthlyGoal[year]; //goal;

      // goalYearToDate
      const goal_total =
        bank.startOfYearAmount[year] +
        goal * (parseInt(month) + _.keys(bank.savings[year]).length - 12);
      bank.goalYearToDate[year][month] =
        bank.totalHolding[year][month] - goal_total;

      // totalMonthInstitution
      _.each(bank.savingsInputs, (header) => {
        if (header.type === 'T') {
          bank.totalMonthInstitution[year][month] = {};
          bank.totalMonthInstitution[year][month][header.id] = _.reduce(
            ['P', 'I'],
            (acc, t) =>
              acc + _.get(bank.savings, [year, month, header.id, t]) || 0,
            0
          );
        }
      });

      // grandTotalMonthInstitution
      bank.grandTotalMonthInstitution[year][month] = {};
      _.each(bank.savingsInputs, (header) => {
        if (header.types.indexOf('T') === -1 || header.type === 'T') {
          if (
            month === bank.headers.firstMonth.toString() &&
            year === bank.headers.firstYear.toString()
          ) {
            if (header.id === bank.savingsInputs[0].id) {
              bank.grandTotalMonthInstitution[year][month][header.id] =
                bank.headers.startingCapital;
            } else {
              bank.grandTotalMonthInstitution[year][month][header.id] = 0;
            }
          } else {
            const prev = prevMonth(year, month);
            bank.grandTotalMonthInstitution[year][month][header.id] = _.get(
              bank.grandTotalMonthInstitution,
              [prev.year, prev.month, header.id],
              0
            );
          }

          bank.grandTotalMonthInstitution[year][month][header.id] += _.reduce(
            ['P', 'I'],
            (acc, t) =>
              acc + _.get(bank.savings, [year, month, header.id, t], 0),
            0
          );
        }
      });

      bank.totalMonthPre[year][month] = 0;
      bank.totalMonthPost[year][month] = 0;
      bank.totalMonthIncome[year][month] = 0;

      _.each(bank.incomeHeaders, (header) => {
        const amount: number = _.get(bank.income, [year, month, header.id], 0);
        if (amount === 0) return;

        bank.totalMonthPre[year][month] += header.pretax
          ? amount / (header.count || 1)
          : 0;
        bank.totalMonthPost[year][month] += header.pretax
          ? 0
          : amount / (header.count || 1);
        bank.totalMonthIncome[year][month] += amount / (header.count || 1);

        bank.yearlyIncome[year][header.id] += amount;

        bank.totalYearPre[year] += header.pretax
          ? amount / (header.count || 1)
          : 0;
        bank.totalYearPost[year] += header.pretax
          ? 0
          : amount / (header.count || 1);
      });

      const im = bank.totalMonthIncome[year][month];
      bank.savingRateMonth[year][month] =
        im === 0 ? 0 : bank.totalMonthSavings[year][month] / im || 0;

      let iy = _(_.range(1, parseInt(month) + 1)).reduce(
        (sum, m) => sum + _.get(bank.totalMonthIncome, [year, m.toString()], 0),
        0
      );
      bank.savingRateYear[year][month] =
        iy === 0
          ? 0
          : (bank.totalHolding[year][month] - bank.startOfYearAmount[year]) /
            iy;
    });
  });

  // grandTotalInstitution = (institution: string, type: string) => 123.45;
  _.each(bank.savingsInputs, (header) => {
    if (!bank.grandTotalInstitution[header.id])
      bank.grandTotalInstitution[header.id] = {};
    if (header.type === 'T') {
      const value = _.reduce(
        ['P', 'I'],
        (v, i) => v + bank.grandTotalInstitution[header.id][i],
        0
      );
      bank.grandTotalInstitution[header.id][header.type] = value;
    } else {
      const sp =
        header.type === 'P' &&
        _.findIndex(bank.savingsInputs, (o) => {
          return o.id === header.id;
        }) === 0
          ? bank.headers.startingCapital
          : 0;
      const ti = _(bank.savings)
        .keys()
        .reduce(
          (acc, year) =>
            acc + bank.totalInstitution[year][header.id][header.type],
          0
        );
      bank.grandTotalInstitution[header.id][header.type] = sp + ti;
    }
  });

  // grandTotalHolding = () => 123.45;
  const year: string = _(bank.savings).keys().last() || '';
  const month: string = _(bank.savings[year]).keys().last() || '';

  bank.grandTotalHolding = bank.totalHolding[year][month];
};
