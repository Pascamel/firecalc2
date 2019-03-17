import _ from 'lodash';
import { firestore } from '../firebase';
import { IIncome, ISavings } from './interfaces';
import * as formatters from './formatters';
import helpers from '../helpers';
import moment from 'moment';


export default class Bank {
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

  constructor() {
    this.showDecimals = false;
    this.savingsHeadersHidden = {};
    this.income = {};
    this.savings = {};
    this.networth = {};
  }

  load = async () => {
    this.loadLocalStorage1();
    const snapshotHeaders = await firestore.getHeaders();
    const snapshotSavings = await firestore.getSavings();
    const snapshotRevenues = await firestore.getRevenues();
    const snapshotNetWorth = await firestore.getNetWorth();

    if (!snapshotHeaders || !snapshotSavings || !snapshotRevenues || !snapshotNetWorth) return;

    this.lastupdate = {};

    if (_.get(snapshotHeaders.data(), 'last_update')) this.lastupdate['headers'] = moment(_.get(snapshotHeaders.data(), 'last_update')).fromNow();
    if (_.get(snapshotSavings.data(), 'last_update')) this.lastupdate['savings'] = moment(_.get(snapshotSavings.data(), 'last_update')).fromNow();
    if (_.get(snapshotRevenues.data(), 'last_update')) this.lastupdate['income'] = moment(_.get(snapshotRevenues.data(), 'last_update')).fromNow();
    if (_.get(snapshotNetWorth.data(), 'last_update')) this.lastupdate['netWorth'] = moment(_.get(snapshotNetWorth.data(), 'last_update')).fromNow();

    this.headers = snapshotHeaders.data() || [];
    let savings_data = _.get(snapshotSavings.data(), 'data', []);
    let revenues_data = _.get(snapshotRevenues.data(), 'data', []);
    
    this.incomeHeaders = formatters.formatIncomeHeaders(this.headers);
    this.savingsHeaders = formatters.formatSavingsHeaders(this.headers);

    this.incomeYearHeaders = {collapsed: {}};
    this.savingsYearHeaders = _.get(snapshotSavings.data(), 'yearly_data', {collapsed: {}, goals: {}});

    this.income = formatters.formatIncome(revenues_data, this.headers);
    this.savings = formatters.formatSavings(savings_data, this.headers);
    this.networth = _.get(snapshotNetWorth.data(), 'data', {});

    this.savingsInputs = formatters.savingsInputs(this.savingsHeaders, {});
    this.savingsInputsHidden = formatters.savingsInputs(this.savingsHeaders, this.savingsHeadersHidden);

    this.savingsHeadersLine1 = formatters.savingsHeadersLine1(this.savingsHeaders, this.savingsHeadersHidden);
    this.savingsHeadersLine2 = formatters.savingsHeadersLine2(this.savingsHeaders, this.savingsHeadersHidden);
  
    this.loadLocalStorage2();
    this.calculateTotals();
  }

  loadLocalStorage1 = () => {
    _.each(JSON.parse(localStorage.getItem('savings_hidden') || '{}'), (value, key) => {
      if (!this.savingsHeadersHidden[key]) this.savingsHeadersHidden[key] = {};
      _.each(value, (v, t) => {
        this.savingsHeadersHidden[key][t] = v;
      });
    });
  }

  loadLocalStorage2 = () => {
    if (!this.savingsYearHeaders.collapsed) this.savingsYearHeaders.collapsed = {};
    _.each(JSON.parse(localStorage.getItem('savings_collapsed') || '{}'), (value, key) => {
      this.savingsYearHeaders.collapsed[key] = value;
    });

    if (!this.incomeYearHeaders.collapsed) this.incomeYearHeaders.collapsed = {};
    _.each(JSON.parse(localStorage.getItem('income_collapsed') || '{}'), (value, key) => {
      this.incomeYearHeaders.collapsed[key] = value;
    });

    this.showDecimals = (parseInt(localStorage.getItem('show_decimals') || '1') > 0);
  };

  updateValue = (index: string, indexes: string[], value: number) => {
    if (indexes.length > 0) {
      _.set(this, _.concat([index], indexes), value);
    } else {
      _.set(this, [index], value);
    }
    this.calculateTotals();
  };

  saveLocalStorage = () => {
    localStorage.setItem('savings_collapsed', JSON.stringify(this.savingsYearHeaders.collapsed));
    localStorage.setItem('income_collapsed', JSON.stringify(this.incomeYearHeaders.collapsed));
    localStorage.setItem('show_decimals', this.showDecimals ? '1' : '0');
    localStorage.setItem('savings_hidden', JSON.stringify(this.savingsHeadersHidden));
  };

  saveHeaders = async () => {
    const data = JSON.parse(JSON.stringify(this.headers));
    data.last_update = (new Date()).getTime();

    try {
      await firestore.setHeaders(data);
      return true;
    } catch {
      return false;
    }
  }

  saveIncome = async () => {
    const payload = {
      last_update: (new Date()).getTime(),
      data: JSON.parse(JSON.stringify(formatters.formatIncomeToSave(this.income))),
      yearly_data: JSON.parse(JSON.stringify(this.incomeYearHeaders))
    };

    try {
      await firestore.setRevenues(payload);
      return true;
    } catch {
      return false;
    }
  };

  saveSavings = async () => {
    const payload = {
      last_update: (new Date()).getTime(),
      data: JSON.parse(JSON.stringify(formatters.formatSavingstaToSave(this.savings))),
      yearly_data: JSON.parse(JSON.stringify(this.savingsYearHeaders)),
      hideDecimals: !this.showDecimals
    };

    try {
      await firestore.setSavings(payload);
      return true;
    } catch {
      return false;
    }
  };

  saveNetWorth = async () => {
    const payload = {
      last_update: (new Date()).getTime(),
      data: JSON.parse(JSON.stringify(this.networth))
    };

    try {
      await firestore.setNetWorth(payload);
      return true;
    } catch {
      return false;
    }
  };

  calculateTotals = () => {
    this.startOfYearAmount = {};
    this.totalMonthSavings = {};
    this.totalHolding = {};
    this.goalMonth = {};
    this.goalYearToDate = {};
    this.totalInstitution = {};
    this.totalMonthInstitution = {};
    this.monthlyGoal = {};
    this.grandTotalInstitution = {};

    this.totalMonthPre = {};
    this.totalMonthPost = {};
    this.totalMonthIncome = {};
    this.totalYearPre = {};
    this.totalYearPost = {};
    this.yearlyIncome = {};
    this.savingRateMonth = {};
    this.savingRateYear = {};

    _.each(this.savings, (year_data, year) => {

      this.totalMonthSavings[year] = {};
      this.totalHolding[year] = {};
      this.goalMonth[year] = {};
      this.goalYearToDate[year] = {};
      this.totalInstitution[year] = {};
      this.totalMonthInstitution[year] = {};
      this.totalMonthPre[year] = {};
      this.totalMonthPost[year] = {};
      this.totalMonthIncome[year] = {};
      this.yearlyIncome[year] = {};
      this.savingRateMonth[year] = {};
      this.savingRateYear[year] = {};
      if (!this.networth[year]) this.networth[year] = {};

      this.startOfYearAmount[year] = (year === this.headers.firstYear.toString()) ? parseFloat(this.headers.startingCapital) : this.totalHolding[(parseInt(year) - 1)]['12'];
      const goal_year = _.get(this.savingsYearHeaders, ['goals', year], 0);
      this.monthlyGoal[year] = (goal_year - this.startOfYearAmount[year]) /  _.keys(this.savings[year]).length;

      //totalInstitution = (year, institution, type, formatted) => {
      _.each(this.savingsInputs, (header: any) => {
        if (!this.totalInstitution[year][header.id]) this.totalInstitution[year][header.id] = {};
        if (header.type === 'T') {
          this.totalInstitution[year][header.id][header.type] =  _.reduce(['P', 'I'], (acc, t) => acc + this.totalInstitution[year][header.id][t], 0);
        } else {
          this.totalInstitution[year][header.id][header.type] = _.reduce(this.savings[year], (v, i) => v + _.get(i, [header.id, header.type], 0), 0);
        }
      });

      this.totalYearPre[year] = 0;
      this.totalYearPost[year] = 0; 
      _.each(this.incomeHeaders, (header: any) => {
        this.yearlyIncome[year][header.id] = 0;
      });

      _.each(year_data, (month_data, month) => {

        // totalMonthSavings = (month: string, year: string, type: string) => 123.45;
        this.totalMonthSavings[year][month] = _.reduce(month_data, (acc: number, v) => {
          return acc + _.get(v, 'P', 0) + _.get(v, 'I', 0)
        }, 0);

        // totalHolding = (month, year, formatted) => {
        if (month === this.headers.firstMonth.toString() && year === this.headers.firstYear.toString()) {
          this.totalHolding[year][month] = parseFloat(this.headers.startingCapital) + this.totalMonthSavings[year][month]
        } else {
          const { year: pyear, month: pmonth } = helpers.prevMonth(year, month);
          this.totalHolding[year][month] = this.totalHolding[pyear][pmonth] + this.totalMonthSavings[year][month]
        }

        // goalMonth = (month: string, year: string) => 123.45;
        const goal = (goal_year - this.startOfYearAmount[year]) /  _.keys(this.savings[year]).length;
        this.goalMonth[year][month] = this.totalMonthSavings[year][month] - this.monthlyGoal[year]; //goal;

        // goalYearToDate = (month, year, formatted) => {
        const goal_total = this.startOfYearAmount[year] + goal * (parseInt(month) + _.keys(this.savings[year]).length - 12);
        this.goalYearToDate[year][month] = this.totalHolding[year][month] - goal_total;

        // totalMonthInstitution = (year: string, month: string, institution: string) => 123.45;
        _.each(this.savingsInputs, (header: any) => {
          if (header.type === 'T') {
            this.totalMonthInstitution[year][month] = {};
            this.totalMonthInstitution[year][month][header.id] = _.reduce(['P', 'I'], (acc, t) => acc + _.get(this.savings, [year, month, header.id, t]) || 0, 0)
          }
        });

        this.totalMonthPre[year][month] = 0;
        this.totalMonthPost[year][month] = 0;
        this.totalMonthIncome[year][month] = 0;

        _.each(this.incomeHeaders, (header: any) => {
          const amount: number = _.get(this.income, [year, month, header.id], 0);
          if (amount === 0) return;

          this.totalMonthPre[year][month] += header.pretax ? (amount / (header.count || 1)) : 0;
          this.totalMonthPost[year][month] += header.pretax ? 0 : (amount / (header.count || 1));
          this.totalMonthIncome[year][month] += amount / (header.count || 1);  

          this.yearlyIncome[year][header.id] += amount;

          this.totalYearPre[year] += header.pretax ? (amount / (header.count || 1)) : 0;
          this.totalYearPost[year] += header.pretax ? 0 : (amount / (header.count || 1));
        });

        const im = this.totalMonthIncome[year][month];
        this.savingRateMonth[year][month] = (im === 0) ? 0 : ((this.totalMonthSavings[year][month] / im) || 0);

        let iy = _(_.range(1, parseInt(month) + 1)).reduce((sum, m) => sum + _.get(this.totalMonthIncome, [year, m.toString()], 0), 0);
        this.savingRateYear[year][month] = (iy === 0) ? 0 : ((this.totalHolding[year][month] - this.startOfYearAmount[year]) / iy);
      });
    });

    // grandTotalInstitution = (institution: string, type: string) => 123.45;
    _.each(this.savingsInputs, (header: any) => {
      if (!this.grandTotalInstitution[header.id]) this.grandTotalInstitution[header.id] = {};
      if (header.type === 'T') {
        const value = _.reduce(['P', 'I'], (v, i) => v + this.grandTotalInstitution[header.id][i], 0);
        this.grandTotalInstitution[header.id][header.type] = value;
      } else {
        const sp = (header.type === 'P' && _.findIndex(this.savingsInputs, (o: any) => { return o.id === header.id; }) === 0) ? this.headers.startingCapital : 0;
        const ti = _(this.savings).keys().reduce((acc, year) => acc + this.totalInstitution[year][header.id][header.type], 0);
        this.grandTotalInstitution[header.id][header.type] = sp + ti;
      }
    });

    // grandTotalHolding = () => 123.45;  
    const year: any = _(this.savings).keys().last();
    const month: any = _(this.savings[year]).keys().last();

    this.grandTotalHolding = this.totalHolding[year][month];  
  }
}
