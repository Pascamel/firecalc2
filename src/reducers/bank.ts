import uuid from 'uuid';

import TYPES from '../actions/types';
import Bank from '../bank';
import { IBank } from '../bank/bank';
import { deepCopy } from '../helpers';

const INITIAL_STATE = {
  bank: {},
  bankLoaded: false,
  bankLoading: false,
  bankSavingsUpdated: false,
  bankIncomeUpdated: false,
  bankExpensesUpdated: false,
  bankOthersUpdated: false,
  bankHeadersUpdated: false,
  saveInProgress: false,
};

const bankReducer = (state = INITIAL_STATE, action: any) => {
  switch (action.type) {
    case TYPES.BANK_LOAD_STARTED:
      return {
        ...state,
        bank: action.payload.bank,
        bankSavingsUpdated: false,
        bankIncomeUpdated: false,
        bankExpensesUpdated: false,
        bankOthersUpdated: false,
        bankHeadersUpdated: false,
        bankLoaded: false,
        bankLoading: true,
      };

    case TYPES.BANK_LOAD_SUCCESS:
      return {
        ...state,
        bank: action.payload.bank,
        bankSavingsUpdated: false,
        bankIncomeUpdated: false,
        bankExpensesUpdated: false,
        bankOthersUpdated: false,
        bankHeadersUpdated: false,
        bankLoaded: true,
        bankLoading: false,
      };

    case TYPES.BANK_LOAD_FAILURE:
      return {
        ...state,
        bank: null,
        bankSavingsUpdated: false,
        bankIncomeUpdated: false,
        bankExpensesUpdated: false,
        bankOthersUpdated: false,
        bankHeadersUpdated: false,
        bankLoaded: false,
        bankLoading: false,
      };

    case TYPES.BANK_UPDATE_VALUE: {
      let new_bank: IBank = deepCopy(state.bank);

      Bank.updateValue(
        new_bank,
        action.payload.index,
        action.payload.indexes,
        action.payload.amount
      );
      Bank.calculateTotals(new_bank);

      return {
        ...state,
        bank: new_bank,
        bankSavingsUpdated:
          action.payload.index === 'savings' ||
          (action.payload.index === 'savingsYearHeaders' &&
            action.payload.indexes.length > 0 &&
            action.payload.indexes[0] === 'goals'),
        bankIncomeUpdated: action.payload.index === 'income',
        bankExpensesUpdated: action.payload.index === 'expenses',
        bankOthersUpdated:
          action.payload.index === 'networth' ||
          action.payload.index === 'expenses' ||
          action.payload.index === 'notes',
        bankHeadersUpdated: action.payload.index === 'headers',
      };
    }

    case TYPES.BANK_UPDATE_VALUE_LOCAL_STORAGE: {
      let new_bank: IBank = deepCopy(state.bank);

      Bank.updateValue(
        new_bank,
        action.payload.index,
        action.payload.indexes,
        action.payload.amount
      );
      Bank.saveLocalStorage(new_bank);

      return {
        ...state,
        bank: new_bank,
      };
    }

    case TYPES.BANK_SAVE_STARTED:
    case TYPES.HEADERS_SAVE_STARTED:
      return {
        ...state,
        saveInProgress: true,
      };

    case TYPES.BANK_SAVE_SUCCESS:
      return {
        ...state,
        bankSavingsUpdated: false,
        bankIncomeUpdated: false,
        bankExpensesUpdated: false,
        bankOthersUpdated: false,
        bankHeadersUpdated: false,
        saveInProgress: false,
      };

    case TYPES.HEADERS_SAVE_SUCCESS:
      return {
        ...state,
        bankHeadersUpdated: false,
        saveInProgress: false,
      };

    case TYPES.BANK_SAVE_FAILURE:
    case TYPES.HEADERS_SAVE_FAILURE:
      return {
        ...state,
        saveInProgress: false,
      };

    case TYPES.HEADERS_NEW_SAVING: {
      let new_bank: IBank = deepCopy(state.bank);
      new_bank.headers.savings.push({
        id: uuid.v4(),
        label: '',
        sublabel: '',
        interest: false,
        icon: '',
        type: 'P',
        types: ['P'],
        displayFrom: false, // boolean;
        displayFromYear: null,
        displayFromMonth: null,
        displayTo: false,
        displayToYear: null,
        displayToMonth: null,
      });

      return {
        ...state,
        bank: new_bank,
        bankHeadersUpdated: true,
      };
    }

    case TYPES.HEADERS_UPDATE_SAVING: {
      let new_bank: IBank = deepCopy(state.bank);

      const idx = new_bank.headers.savings.findIndex(
        (h) => h.id === action.payload.header.id
      );

      new_bank.headers.savings = [
        ...new_bank.headers.savings.slice(0, idx),
        action.payload.header,
        ...new_bank.headers.savings.slice(idx + 1),
      ];

      Bank.formatHeaders(new_bank);

      return {
        ...state,
        bank: new_bank,
        bankHeadersUpdated: true,
      };
    }

    case TYPES.HEADERS_DELETE_SAVING: {
      let new_bank: IBank = deepCopy(state.bank);

      new_bank.headers.savings = [
        ...new_bank.headers.savings.filter(
          (h) => h.id !== action.payload.header.id
        ),
      ];

      Bank.formatHeaders(new_bank);

      return {
        ...state,
        bank: new_bank,
        bankHeadersUpdated: true,
      };
    }

    case TYPES.HEADERS_SWITCH_SAVING: {
      let new_bank: IBank = deepCopy(state.bank);

      var tmp = new_bank.headers.savings[action.payload.index1];
      new_bank.headers.savings[action.payload.index1] =
        new_bank.headers.savings[action.payload.index2];
      new_bank.headers.savings[action.payload.index2] = tmp;

      return {
        ...state,
        bank: new_bank,
        bankHeadersUpdated: true,
      };
    }

    case TYPES.HEADERS_NEW_INCOME: {
      let new_bank: IBank = deepCopy(state.bank);
      new_bank.headers.incomes.push({
        id: uuid.v4(),
        label: '',
        pretax: false,
        count: 1,
      });

      return {
        ...state,
        bank: new_bank,
        bankHeadersUpdated: true,
      };
    }

    case TYPES.HEADERS_UPDATE_INCOME: {
      let new_bank: IBank = deepCopy(state.bank);

      const idx = new_bank.headers.incomes.findIndex(
        (h) => h.id === action.payload.header.id
      );

      new_bank.headers.incomes = [
        ...new_bank.headers.incomes.slice(0, idx),
        action.payload.header,
        ...new_bank.headers.incomes.slice(idx + 1),
      ];

      Bank.formatHeaders(new_bank);

      return {
        ...state,
        bank: new_bank,
        bankHeadersUpdated: true,
      };
    }

    case TYPES.HEADERS_DELETE_INCOME: {
      let new_bank: IBank = deepCopy(state.bank);

      new_bank.headers.incomes = [
        ...new_bank.headers.incomes.filter(
          (h) => h.id !== action.payload.header.id
        ),
      ];

      Bank.formatHeaders(new_bank);

      return {
        ...state,
        bank: new_bank,
        bankHeadersUpdated: true,
      };
    }

    case TYPES.HEADERS_SWITCH_INCOME: {
      let new_bank: IBank = deepCopy(state.bank);

      let tmp = new_bank.headers.incomes[action.payload.index1];
      new_bank.headers.incomes[action.payload.index1] =
        new_bank.headers.incomes[action.payload.index2];
      new_bank.headers.incomes[action.payload.index2] = tmp;

      return {
        ...state,
        bank: new_bank,
        bankHeadersUpdated: true,
      };
    }

    case TYPES.HEADERS_NEW_EXPENSE: {
      let new_bank: IBank = deepCopy(state.bank);
      new_bank.headers.expenses.push({
        id: uuid.v4(),
        label: '',
        type: -1,
        isFuture: action.payload.isFuture,
        isNecessary: false,
        amount: 0,
        startMonth: null,
        startYear: null,
      });

      return {
        ...state,
        bank: new_bank,
        bankHeadersUpdated: true,
      };
    }

    case TYPES.HEADERS_UPDATE_EXPENSE: {
      let new_bank: IBank = deepCopy(state.bank);

      const idx = new_bank.headers.expenses.findIndex(
        (h) => h.id === action.payload.header.id
      );

      new_bank.headers.expenses = [
        ...new_bank.headers.expenses.slice(0, idx),
        action.payload.header,
        ...new_bank.headers.expenses.slice(idx + 1),
      ];

      Bank.formatHeaders(new_bank);

      return {
        ...state,
        bank: new_bank,
        bankHeadersUpdated: true,
      };
    }

    case TYPES.HEADERS_DELETE_EXPENSE: {
      let new_bank: IBank = deepCopy(state.bank);

      new_bank.headers.expenses = [
        ...new_bank.headers.expenses.filter(
          (h) => h.id !== action.payload.header.id
        ),
      ];

      Bank.formatHeaders(new_bank);

      return {
        ...state,
        bank: new_bank,
        bankHeadersUpdated: true,
      };
    }

    case TYPES.HEADERS_SWITCH_EXPENSE: {
      let new_bank: IBank = deepCopy(state.bank);

      let tmp = new_bank.headers.expenses[action.payload.index1];
      new_bank.headers.expenses[action.payload.index1] =
        new_bank.headers.expenses[action.payload.index2];
      new_bank.headers.expenses[action.payload.index2] = tmp;

      return {
        ...state,
        bank: new_bank,
        bankHeadersUpdated: true,
      };
    }

    default:
      return state;
  }
};

export default bankReducer;
