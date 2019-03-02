import _ from 'lodash';
import { firestore } from '../firebase';
import { IIncome, ISavings } from './interfaces';
import * as formatters from './formatters';


export default class Bank {
  income: IIncome|null; //any
  savings: ISavings|null;

  constructor() {
    this.income = null;
    this.savings = null;
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

    this.income = formatters.formatIncome(revenues_data, headers);
    this.savings = formatters.formatSavings(savings_data, headers);
  }
}