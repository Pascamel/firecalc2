import _ from 'lodash';
import { firestore } from '../firebase';
import { IIncome, ISavings } from './interfaces';
import * as formatters from './formatters';
import helpers from '../helpers';
import moment from 'moment';

export interface IBank {
  showDecimals: boolean;
  savingsHeadersHidden: {
    [institution: string]: {
      [type: string]: boolean;
    }
  };

  lastupdate: any;
  headers: any;
  firstYear: any;
  firstMonth: any;
  startingCapital: any;

  income: IIncome;
  savings: ISavings;
  networth: any;
  savingsInputs: any;
  savingsInputsHidden: any;
  incomeHeaders: any;
  savingsHeaders: any;
  incomeYearHeaders: any;
  savingsYearHeaders: any;
  savingsHeadersLine1: any;
  savingsHeadersLine2: any;

  startOfYearAmount: any;
  totalMonthSavings: any;
  totalHolding: any;
  goalMonth: any;
  goalYearToDate: any;
  totalInstitution: any;
  totalMonthInstitution: any;
  grandTotalMonthInstitution: any;
  monthlyGoal: any;
  grandTotalInstitution: any;
  grandTotalHolding: any;

  totalMonthPre: any;
  totalMonthPost: any;
  totalMonthIncome: any;
  totalYearPre: any;
  totalYearPost: any;
  yearlyIncome: any;
  savingRateMonth: any;
  savingRateYear: any;
}

export const load = async (uid: string): Promise<IBank> => {

  let bank: IBank = ({} as any);

  loadLocalStorage1(bank);
  const snapshotHeaders = await firestore.getHeaders(uid);
  const snapshotSavings = await firestore.getSavings(uid);
  const snapshotRevenues = await firestore.getRevenues(uid);
  const snapshotNetWorth = await firestore.getNetWorth(uid);

  if (!snapshotHeaders || !snapshotSavings || !snapshotRevenues || !snapshotNetWorth) return bank;

  bank.lastupdate = {};

  if (_.get(snapshotHeaders.data(), 'last_update')) bank.lastupdate['headers'] = moment(_.get(snapshotHeaders.data(), 'last_update')).fromNow();
  if (_.get(snapshotSavings.data(), 'last_update')) bank.lastupdate['savings'] = moment(_.get(snapshotSavings.data(), 'last_update')).fromNow();
  if (_.get(snapshotRevenues.data(), 'last_update')) bank.lastupdate['income'] = moment(_.get(snapshotRevenues.data(), 'last_update')).fromNow();
  if (_.get(snapshotNetWorth.data(), 'last_update')) bank.lastupdate['netWorth'] = moment(_.get(snapshotNetWorth.data(), 'last_update')).fromNow();

  bank.headers = snapshotHeaders.data() || [];
  let savings_data = _.get(snapshotSavings.data(), 'data', []);
  let revenues_data = _.get(snapshotRevenues.data(), 'data', []);
  
  bank.incomeHeaders = formatters.formatIncomeHeaders(bank.headers);
  bank.savingsHeaders = formatters.formatSavingsHeaders(bank.headers);

  bank.incomeYearHeaders = {collapsed: {}};
  bank.savingsYearHeaders = _.get(snapshotSavings.data(), 'yearly_data', {collapsed: {}, goals: {}});

  bank.income = formatters.formatIncome(revenues_data, bank.headers);
  bank.savings = formatters.formatSavings(savings_data, bank.headers);
  bank.networth = _.get(snapshotNetWorth.data(), 'data', {});

  bank.savingsInputs = formatters.savingsInputs(bank.savingsHeaders, {});
  bank.savingsInputsHidden = formatters.savingsInputs(bank.savingsHeaders, bank.savingsHeadersHidden);

  bank.savingsHeadersLine1 = formatters.savingsHeadersLine1(bank.savingsHeaders, bank.savingsHeadersHidden);
  bank.savingsHeadersLine2 = formatters.savingsHeadersLine2(bank.savingsHeaders, bank.savingsHeadersHidden);

  loadLocalStorage2(bank);
  calculateTotals(bank);

  return bank;
}

export const loadLocalStorage1 = (bank: IBank) => {
  if (!bank.savingsHeadersHidden) bank.savingsHeadersHidden = {};
  _.each(JSON.parse(localStorage.getItem('savings_hidden') || '{}'), (value, key) => {
    if (!bank.savingsHeadersHidden[key]) bank.savingsHeadersHidden[key] = {};
    _.each(value, (v, t) => {
      bank.savingsHeadersHidden[key][t] = v;
    });
  });
}

export const loadLocalStorage2 = (bank: IBank) => {
  if (!bank.savingsYearHeaders.collapsed) bank.savingsYearHeaders.collapsed = {};
  _.each(JSON.parse(localStorage.getItem('savings_collapsed') || '{}'), (value, key) => {
    bank.savingsYearHeaders.collapsed[key] = value;
  });

  if (!bank.incomeYearHeaders.collapsed) bank.incomeYearHeaders.collapsed = {};
  _.each(JSON.parse(localStorage.getItem('income_collapsed') || '{}'), (value, key) => {
    bank.incomeYearHeaders.collapsed[key] = value;
  });

  bank.showDecimals = (parseInt(localStorage.getItem('show_decimals') || '1') > 0);
};

export const updateValue = (bank: IBank, index: string, indexes: string[], value: number|boolean) => {
  if (indexes.length > 0) {
    _.set(bank, _.concat([index], indexes), value);
  } else {
    console.log('cas2', _.get(bank, [index]));
    _.set(bank, [index], value);
  }
};

export const saveLocalStorage = (bank: IBank) => {
  localStorage.setItem('savings_collapsed', JSON.stringify(bank.savingsYearHeaders.collapsed));
  localStorage.setItem('income_collapsed', JSON.stringify(bank.incomeYearHeaders.collapsed));
  localStorage.setItem('show_decimals', bank.showDecimals ? '1' : '0');
  localStorage.setItem('savings_hidden', JSON.stringify(bank.savingsHeadersHidden));
};

export const saveHeaders = async (uid: string, bank: IBank) => {
  const data = JSON.parse(JSON.stringify(bank.headers));
  data.last_update = (new Date()).getTime();

  try {
    await firestore.setHeaders(uid, data);
    return true;
  } catch {
    return false;
  }
}

export const saveIncome = async (uid: string, bank: IBank) => {
  const payload = {
    last_update: (new Date()).getTime(),
    data: JSON.parse(JSON.stringify(formatters.formatIncomeToSave(bank.income))),
    yearly_data: JSON.parse(JSON.stringify(bank.incomeYearHeaders))
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
    last_update: (new Date()).getTime(),
    data: JSON.parse(JSON.stringify(formatters.formatSavingstaToSave(bank.savings))),
    yearly_data: JSON.parse(JSON.stringify(bank.savingsYearHeaders)),
    hideDecimals: !bank.showDecimals
  };

  try {
    await firestore.setSavings(uid, payload);
    return true;
  } catch {
    return false;
  }
};

export const saveNetWorth = async (uid: string, bank: IBank) => {
  const payload = {
    last_update: (new Date()).getTime(),
    data: JSON.parse(JSON.stringify(bank.networth))
  };

  try {
    await firestore.setNetWorth(uid, payload);
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

    bank.startOfYearAmount[year] = (year === bank.headers.firstYear.toString()) ? parseFloat(bank.headers.startingCapital) : bank.totalHolding[(parseInt(year) - 1)]['12'];
    const goal_year = _.get(bank.savingsYearHeaders, ['goals', year], 0);
    bank.monthlyGoal[year] = (goal_year - bank.startOfYearAmount[year]) /  _.keys(bank.savings[year]).length;

    //totalInstitution
    _.each(bank.savingsInputs, (header: any) => {
      if (!bank.totalInstitution[year][header.id]) bank.totalInstitution[year][header.id] = {};
      if (header.type === 'T') {
        bank.totalInstitution[year][header.id][header.type] =  _.reduce(['P', 'I'], (acc, t) => acc + bank.totalInstitution[year][header.id][t], 0);
      } else {
        bank.totalInstitution[year][header.id][header.type] = _.reduce(bank.savings[year], (v, i) => v + _.get(i, [header.id, header.type], 0), 0);
      }
    });

    bank.totalYearPre[year] = 0;
    bank.totalYearPost[year] = 0; 
    _.each(bank.incomeHeaders, (header: any) => {
      bank.yearlyIncome[year][header.id] = 0;
    });

    _.each(year_data, (month_data, month) => {

      // totalMonthSavings
      bank.totalMonthSavings[year][month] = _.reduce(month_data, (acc: number, v) => {
        return acc + _.get(v, 'P', 0) + _.get(v, 'I', 0)
      }, 0);

      // totalHolding
      if (month === bank.headers.firstMonth.toString() && year === bank.headers.firstYear.toString()) {
        bank.totalHolding[year][month] = parseFloat(bank.headers.startingCapital) + bank.totalMonthSavings[year][month]
      } else {
        const { year: pyear, month: pmonth } = helpers.prevMonth(year, month);
        bank.totalHolding[year][month] = bank.totalHolding[pyear][pmonth] + bank.totalMonthSavings[year][month]
      }

      // goalMonth
      const goal = (goal_year - bank.startOfYearAmount[year]) /  _.keys(bank.savings[year]).length;
      bank.goalMonth[year][month] = bank.totalMonthSavings[year][month] - bank.monthlyGoal[year]; //goal;

      // goalYearToDate
      const goal_total = bank.startOfYearAmount[year] + goal * (parseInt(month) + _.keys(bank.savings[year]).length - 12);
      bank.goalYearToDate[year][month] = bank.totalHolding[year][month] - goal_total;

      // totalMonthInstitution
      _.each(bank.savingsInputs, (header: any) => {
        if (header.type === 'T') {
          bank.totalMonthInstitution[year][month] = {};
          bank.totalMonthInstitution[year][month][header.id] = _.reduce(['P', 'I'], (acc, t) => acc + _.get(bank.savings, [year, month, header.id, t]) || 0, 0)
        }
      });

      // grandTotalMonthInstitution
      bank.grandTotalMonthInstitution[year][month] = {};
      _.each(bank.savingsInputs, (header: any) => {
        if ((header.types.indexOf('T') === -1) || (header.type === 'T')) {
          if (month === bank.headers.firstMonth.toString() && year === bank.headers.firstYear.toString()) {
            if (header.id === bank.savingsInputs[0].id) {
              bank.grandTotalMonthInstitution[year][month][header.id] = bank.headers.startingCapital;
            } else {
              bank.grandTotalMonthInstitution[year][month][header.id] = 0;
            }
          } else {
            const prev = helpers.prevMonth(year, month);
            bank.grandTotalMonthInstitution[year][month][header.id] = bank.grandTotalMonthInstitution[prev.year][prev.month][header.id];
          }

          bank.grandTotalMonthInstitution[year][month][header.id] += _.reduce(['P', 'I'], (acc, t) => acc + _.get(bank.savings, [year, month, header.id, t], 0), 0);
        }
      });

      bank.totalMonthPre[year][month] = 0;
      bank.totalMonthPost[year][month] = 0;
      bank.totalMonthIncome[year][month] = 0;

      _.each(bank.incomeHeaders, (header: any) => {
        const amount: number = _.get(bank.income, [year, month, header.id], 0);
        if (amount === 0) return;

        bank.totalMonthPre[year][month] += header.pretax ? (amount / (header.count || 1)) : 0;
        bank.totalMonthPost[year][month] += header.pretax ? 0 : (amount / (header.count || 1));
        bank.totalMonthIncome[year][month] += amount / (header.count || 1);  

        bank.yearlyIncome[year][header.id] += amount;

        bank.totalYearPre[year] += header.pretax ? (amount / (header.count || 1)) : 0;
        bank.totalYearPost[year] += header.pretax ? 0 : (amount / (header.count || 1));
      });

      const im = bank.totalMonthIncome[year][month];
      bank.savingRateMonth[year][month] = (im === 0) ? 0 : ((bank.totalMonthSavings[year][month] / im) || 0);

      let iy = _(_.range(1, parseInt(month) + 1)).reduce((sum, m) => sum + _.get(bank.totalMonthIncome, [year, m.toString()], 0), 0);
      bank.savingRateYear[year][month] = (iy === 0) ? 0 : ((bank.totalHolding[year][month] - bank.startOfYearAmount[year]) / iy);
    });
  });

  // grandTotalInstitution = (institution: string, type: string) => 123.45;
  _.each(bank.savingsInputs, (header: any) => {
    if (!bank.grandTotalInstitution[header.id]) bank.grandTotalInstitution[header.id] = {};
    if (header.type === 'T') {
      const value = _.reduce(['P', 'I'], (v, i) => v + bank.grandTotalInstitution[header.id][i], 0);
      bank.grandTotalInstitution[header.id][header.type] = value;
    } else {
      const sp = (header.type === 'P' && _.findIndex(bank.savingsInputs, (o: any) => { return o.id === header.id; }) === 0) ? bank.headers.startingCapital : 0;
      const ti = _(bank.savings).keys().reduce((acc, year) => acc + bank.totalInstitution[year][header.id][header.type], 0);
      bank.grandTotalInstitution[header.id][header.type] = sp + ti;
    }
  });

  // grandTotalHolding = () => 123.45;  
  const year: any = _(bank.savings).keys().last();
  const month: any = _(bank.savings[year]).keys().last();

  bank.grandTotalHolding = bank.totalHolding[year][month];  
}
