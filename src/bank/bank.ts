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

  income: IIncome|null;
  savings: ISavings|null;
  savingsInputs: any;
  savingsInputsHidden: any;
  incomeHeaders: any;
  savingsHeaders: any;

  constructor() {
    this.showDecimals = false;
    this.savingsHeadersHidden = {};
    this.income = null;
    this.savings = null;
  }

  load = async () => {
    this.loadLocalStorage();

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
    this.savingsHeaders = headers.savings;

    this.income = formatters.formatIncome(revenues_data, headers);
    this.savings = formatters.formatSavings(savings_data, headers);

    this.savingsInputs = formatters.savingsInputs(this.savingsHeaders, {});
    this.savingsInputsHidden = formatters.savingsInputs(this.savingsHeaders, this.savingsHeadersHidden);
  }

  loadLocalStorage = () => {
    _.each(JSON.parse(localStorage.getItem('savings_collapsed') || '{}'), (value, key) => {
      // this.savingsYearHeaders.collapsed[key] = value;
    });
    _.each(JSON.parse(localStorage.getItem('income_collapsed') || '{}'), (value, key) => {
      // this.incomeYearHeaders.collapsed[key] = value;
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
}

