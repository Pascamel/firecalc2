import _ from 'lodash';
import { firestore } from '../firebase';
import { IIncome, ISavings } from './interfaces';
import * as formatters from './formatters';
import helpers from '../helpers';


export default class Bank {
  showDecimals: boolean;
  savingsHeadersHidden: {
    [institution: string]: {
      [type: string]: boolean;
    }
  };

  firstYear: any;
  firstMonth: any;
  startingCapital: any;

  income: IIncome;
  savings: ISavings;
  savingsInputs: any;
  savingsInputsHidden: any;
  incomeHeaders: any;
  savingsHeaders: any;
  incomeYearHeaders: any;
  savingsYearHeaders: any;
  savingsHeadersLine1: any;
  savingsHeadersLine2: any;

  totalMonthSavings: any;
  totalHolding: any;
  goalMonth: any;
  goalYearToDate: any;
  totalInstitution: any;
  monthlyGoal: any;

  constructor() {
    this.showDecimals = false;
    this.savingsHeadersHidden = {};
    this.income = {};
    this.savings = {};
  }

  load = async () => {
    this.loadLocalStorage1();
    const snapshotHeaders = await firestore.getHeaders();
    const snapshotSavings = await firestore.getSavings();
    const snapshotRevenues = await firestore.getRevenues();

    if (!snapshotHeaders) return;
    if (!snapshotSavings) return;
    if (!snapshotRevenues) return;

    let headers = snapshotHeaders.data() || [];
    let savings = snapshotSavings.data();
    let revenues = snapshotRevenues.data();
    let savings_data = _.get(savings, 'data', []);
    let revenues_data = _.get(revenues, 'data', []);
    
    this.incomeHeaders = formatters.formatIncomeHeaders(headers);
    this.savingsHeaders = formatters.formatSavingsHeaders(headers);

    this.firstYear = headers.firstYear;
    this.firstMonth = headers.firstMonth;
    this.startingCapital = headers.startingCapital;

    this.incomeYearHeaders = {collapsed: {}};
    this.savingsYearHeaders = _.get(snapshotSavings.data(), 'yearly_data', {collapsed: {}, goals: {}});

    this.income = formatters.formatIncome(revenues_data, headers);
    this.savings = formatters.formatSavings(savings_data, headers);

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
      // _.set(this[index], indexes, value);
    } else {
      _.set(this, [index], value);
    }
  };

  saveLocalStorage = () => {
    localStorage.setItem('savings_collapsed', JSON.stringify(this.savingsYearHeaders.collapsed));
    localStorage.setItem('income_collapsed', JSON.stringify(this.incomeYearHeaders.collapsed));
    localStorage.setItem('show_decimals', this.showDecimals ? '1' : '0');
    localStorage.setItem('savings_hidden', JSON.stringify(this.savingsHeadersHidden));
  };

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

  // goalMonth = (month: string, year: string) => 123.45;
  // monthlyGoal = (year: string) => 123.45;
  // goalYearToDate = (month: string, year: string) => 123.45;
  savingRateMonth = (year: string, month: string) => 123.45;
  savingRateYear = (year: string, month: string) => 123.45;
  startOfYearAmount = (year: string) => 123.45;
  // totalInstitution = (year: string, institution: string, type: string) => 123.45;
  // totalHolding = (month: string, year: string) => 123.45;

  totalMonthInstitution = (year: string, month: string, institution: string) => 123.45;
  // totalMonthSavings = (month: string, year: string, type: string) => 123.45;

  grandTotalInstitution = (institution: string, type: string) => 123.45;
  grandTotalHolding = () => 123.45;

  yearlyIncome = (year: string, header: string) => 123.45;
  totalYearPost = (year: string) => 123.45;
  totalYearPre = (year: string) => 123.45;
  totalMonthIncome = (year: string, month: string) => 123.45;
  totalMonthPost = (year: string, month: string) => 123.45;
  totalMonthPre = (year: string, month: string) => 123.45;

  calculateTotals = () => {

    this.totalMonthSavings = {};
    this.totalHolding = {};
    this.goalMonth = {};
    this.goalYearToDate = {};
    this.totalInstitution = {};
    this.monthlyGoal = {};

    _.each(this.savings, (year_data, year) => {

      this.totalMonthSavings[year] = {};
      this.totalHolding[year] = {};
      this.goalMonth[year] = {};
      this.goalYearToDate[year] = {};
      this.totalInstitution[year] = {};

      const start_of_year = (year === this.firstYear.toString()) ? parseFloat(this.startingCapital) : this.totalHolding[(parseInt(year) - 1)]['12'];
      const goal_year = _.get(this.savingsYearHeaders, ['goals', year], 0);

      this.monthlyGoal[year] = (goal_year - start_of_year) /  _.keys(this.savings[year]).length;
  

      _.each(year_data, (month_data, month) => {

        // totalMonthSavings = (month: string, year: string, type: string) => 123.45;
        this.totalMonthSavings[year][month] = _.reduce(month_data, (acc: number, v) => {
          return acc + _.get(v, 'P', 0) + _.get(v, 'I', 0)
        }, 0);

        // totalHolding = (month, year, formatted) => {
        if (month === this.firstMonth.toString() && year === this.firstYear.toString()) {
          this.totalHolding[year][month] = parseFloat(this.startingCapital) + this.totalMonthSavings[year][month]
        } else {
          const { year: pyear, month: pmonth } = helpers.prevMonth(year, month);
          this.totalHolding[year][month] = this.totalHolding[pyear][pmonth] + this.totalMonthSavings[year][month]
        }

        // goalMonth = (month: string, year: string) => 123.45;
        const goal = (goal_year - start_of_year) /  _.keys(this.savings[year]).length;
        this.goalMonth[year][month] = this.totalMonthSavings[year][month] - this.monthlyGoal[year]; //goal;

        // goalYearToDate = (month, year, formatted) => {
        const goal_total = start_of_year + goal * (parseInt(month) + _.keys(this.savings[year]).length - 12);
        this.goalYearToDate[year][month] = this.totalHolding[year][month] - goal_total;

        //totalInstitution = (year, institution, type, formatted) => {
        _.each(this.savingsInputs, (header: any) => {
          if (!this.totalInstitution[year][header.id]) this.totalInstitution[year][header.id] = {};
          if (header.type === 'T') {
            this.totalInstitution[year][header.id][header.type] =  _.reduce(['P', 'I'], (acc, t) => acc + this.totalInstitution[year][header.id][t], 0);
          } else {
            this.totalInstitution[year][header.id][header.type] = _.reduce(this.savings[year], (v, i) => v + _.get(i, [header.id, header.type], 0), 0);
          }
        });
          // const idxYear = _(this.savings).keys().indexOf(year);
          // let value = 0;
          // if (idxYear < 0) {
          //   value = 0;
          // } else if (type === 'T') {
          //   value =  _.reduce(['P', 'I'], (v, i) => v + this.totalInstitution(year, institution, i, false), 0);
          // } else {
          //   value = _.reduce(this.savings[year], (v, i) => v + _.get(i, [institution, type], 0), 0);
          // }
      
          
        // };


      });
    });
    

    

    // monthlyGoal = (year: string) => 123.45;
    // goalYearToDate = (month: string, year: string) => 123.45;
    // savingRateMonth = (year: string, month: string) => 123.45;
    // savingRateYear = (year: string, month: string) => 123.45;
    // startOfYearAmount = (year: string) => 123.45;
    // totalInstitution = (year: string, institution: string, type: string) => 123.45;
    // totalHolding = (month: string, year: string) => 123.45;

    // totalMonthInstitution = (year: string, month: string, institution: string) => 123.45;    

    // grandTotalInstitution = (institution: string, type: string) => 123.45;
    // grandTotalHolding = () => 123.45;

    // yearlyIncome = (year: string, header: string) => 123.45;
    // totalYearPost = (year: string) => 123.45;
    // totalYearPre = (year: string) => 123.45;
    // totalMonthIncome = (year: string, month: string) => 123.45;
    // totalMonthPost = (year: string, month: string) => 123.45;
    // totalMonthPre = (year: string, month: string) => 123.45;
  }
}

