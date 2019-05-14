import * as TYPES from './types';
import * as Bank from '../bank';
import _ from 'lodash';
import { IIncomeHeader, ISavingsHeader } from '../bank/interfaces';


export const loadBank = (uid: string) => {
  return (dispatch: any) => {
    const bank = {};
    dispatch(({
      type: TYPES.BANK_LOAD_STARTED,
      payload: {bank}
    }));

    Bank.load(uid).then((bank: Bank.IBank) => {
      dispatch(({
        type: TYPES.BANK_LOAD_SUCCESS,
        payload: {bank}
      }));
    }).catch((error: any) => {
      dispatch(({
        type: TYPES.BANK_LOAD_FAILURE,
        payload: {error}
      }));
    });
  };
};


export const updateValue = (bank: Bank.IBank, index: string, indexes: string[], amount: number|boolean) => {
  return (dispatch: any) => {
    Bank.updateValue(bank, index, indexes, amount);
    Bank.calculateTotals(bank);
    
    dispatch(({
      type: TYPES.BANK_UPDATE_VALUE,
      payload: {bank}
    }));
  };
}

export const saveBank = (uid: string, bank: Bank.IBank) => {
  return (dispatch: any) => {
    dispatch(({
      type: TYPES.BANK_SAVE_STARTED,
      payload: {bank}
    }));

    Bank.saveSavings(uid, bank).then(() => {
      Bank.saveIncome(uid, bank).then(() => {
        Bank.saveNetWorth(uid, bank).then(() => {
          dispatch(({
            type: TYPES.BANK_SAVE_SUCCESS,
            payload: {bank}
          }));
        }).catch((error: any) => {
          dispatch(({
            type: TYPES.BANK_SAVE_FAILURE,
            payload: {error}
          }));
        });
      }).catch((error: any) => {
        dispatch(({
          type: TYPES.BANK_SAVE_FAILURE,
          payload: {error}
        }));
      });
    }).catch((error: any) => {
      dispatch(({
        type: TYPES.BANK_SAVE_FAILURE,
        payload: {error}
      }));
    });
  };
}

export const newIncomeHeader = (bank: Bank.IBank, header: IIncomeHeader) => {
  return (dispatch: any) => {
    dispatch(({
      type: TYPES.HEADERS_NEW_INCOME,
      payload: {bank, header}
    }));
  }
}
export const updateIncomeHeader = (bank: Bank.IBank, header: IIncomeHeader) => {
  return (dispatch: any) => {
    dispatch(({
      type: TYPES.HEADERS_UPDATE_INCOME,
      payload: {bank, header}
    }));
  }
}

export const newSavingHeader = (bank: Bank.IBank, header: ISavingsHeader) => {
  return (dispatch: any) => {
    dispatch(({
      type: TYPES.HEADERS_NEW_SAVING,
      payload: {bank, header}
    }));
  }
}

export const updateSavingHeader = (bank: Bank.IBank, header: ISavingsHeader) => {
  return (dispatch: any) => {

    console.log('bank', bank);
    console.log('bank.headers', bank.headers);
    console.log('bank.headers.savings', bank.headers.savings);

    const test = _(bank.headers.savings).map((h: any, i: any) => {
      console.log('h', h);
      console.log('i', i);

      if (h.id === header.id) return i;
    }).compact().value();

    if (!test.length) return;

    console.log('before', bank.headers.savings[test[0]]);
    bank.headers.savings[test[0]].label = 'coucoucouasdf';  //header;
    bank.headers.savings[test[0]].$edit = true;
    console.log('after', bank.headers.savings[test[0]]);

    console.log('test', test);

    // Bank.calculateTotals(bank);

    dispatch(({
      type: TYPES.HEADERS_UPDATE_SAVING,
      payload: {bank, header}
    }));
  }
}

export const saveHeaders = (uid: string, bank: Bank.IBank) => {
  return (dispatch: any) => {
    dispatch(({
      type: TYPES.HEADERS_SAVE_STARTED,
      payload: {bank}
    }));

    Bank.saveHeaders(uid, bank).then(() => {
      dispatch(({
        type: TYPES.HEADERS_SAVE_SUCCESS,
        payload: {bank}
      }));
    }).catch((error: any) => {
      dispatch(({
        type: TYPES.HEADERS_SAVE_FAILURE,
        payload: {error}
      }));
    });
  };
}
