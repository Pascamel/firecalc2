import _ from 'lodash';
import { firestore } from '../firebase';
import { IIncome, ISavings } from './interfaces';
import * as formatters from './formatters';


export default class Bank {
  showDecimals: boolean;
  savingsHeadersHidden: {
    [institution: string]: {
      [type: string]: boolean;
    }
  };

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

  constructor() {
    this.showDecimals = false;
    this.savingsHeadersHidden = {};
    this.income = {};
    this.savings = {};
  }

  load = async () => {
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

    this.incomeYearHeaders = {collapsed: {}};
    this.savingsYearHeaders = _.get(snapshotSavings.data(), 'yearly_data', {collapsed: {}, goals: {}});

    this.income = formatters.formatIncome(revenues_data, headers);
    this.savings = formatters.formatSavings(savings_data, headers);

    this.savingsInputs = formatters.savingsInputs(this.savingsHeaders, {});
    this.savingsInputsHidden = formatters.savingsInputs(this.savingsHeaders, this.savingsHeadersHidden);

    this.savingsHeadersLine1 = formatters.savingsHeadersLine1(this.savingsHeaders, this.savingsHeadersHidden);
    this.savingsHeadersLine2 = formatters.savingsHeadersLine2(this.savingsHeaders, this.savingsHeadersHidden);
  
    this.loadLocalStorage();
    this.calculateTotals();
  }

  loadLocalStorage = () => {
    if (!this.savingsYearHeaders.collapsed) this.savingsYearHeaders.collapsed = {};
    _.each(JSON.parse(localStorage.getItem('savings_collapsed') || '{}'), (value, key) => {
      this.savingsYearHeaders.collapsed[key] = value;
    });

    if (!this.incomeYearHeaders.collapsed) this.incomeYearHeaders.collapsed = {};
    _.each(JSON.parse(localStorage.getItem('income_collapsed') || '{}'), (value, key) => {
      this.incomeYearHeaders.collapsed[key] = value;
    });

    _.each(JSON.parse(localStorage.getItem('savings_hidden') || '{}'), (value, key) => {
      if (!this.savingsHeadersHidden[key]) this.savingsHeadersHidden[key] = {};
      _.each(value, (v, t) => {
        this.savingsHeadersHidden[key][t] = v;
      });
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

  goalMonth = (month: string, year: string) => 123.45;
  monthlyGoal = (year: string) => 123.45;
  goalYearToDate = (month: string, year: string) => 123.45;
  savingRateMonth = (year: string, month: string) => 123.45;
  savingRateYear = (year: string, month: string) => 123.45;
  startOfYearAmount = (year: string) => 123.45;
  totalInstitution = (year: string, institution: string, type: string) => 123.45;
  totalHolding = (month: string, year: string) => 123.45;

  totalMonthInstitution = (year: string, month: string, institution: string) => 123.45;
  totalMonthSavings = (month: string, year: string, type: string) => 123.45;

  grandTotalInstitution = (institution: string, type: string) => 123.45;
  grandTotalHolding = () => 123.45;

  yearlyIncome = (year: string, header: string) => 123.45;
  totalYearPost = (year: string) => 123.45;
  totalYearPre = (year: string) => 123.45;
  totalMonthIncome = (year: string, month: string) => 123.45;
  totalMonthPost = (year: string, month: string) => 123.45;
  totalMonthPre = (year: string, month: string) => 123.45;

  calculateTotals = () => {

  }
}

