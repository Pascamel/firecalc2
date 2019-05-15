import * as TYPES from './types';
import * as Bank from '../bank';
import _ from 'lodash';
import uuid from 'uuid';
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
      payload: {
        bank: JSON.parse(JSON.stringify(bank))
      }
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
            payload: {
              bank: JSON.parse(JSON.stringify(bank))
            }
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
      payload: {
        bank: JSON.parse(JSON.stringify(bank)), 
        header:header
      }
    }));
  }
}

export const updateIncomeHeader = (bank: Bank.IBank, header: IIncomeHeader) => {
  return (dispatch: any) => {
    dispatch(({
      type: TYPES.HEADERS_UPDATE_INCOME,
      payload: {
        bank: JSON.parse(JSON.stringify(bank)), 
        header:header
      }
    }));
  }
}

export const newSavingHeader = (bank: Bank.IBank) => {
  return (dispatch: any) => {
    bank.headers.savings.push({
      $edit: true,
      id: uuid.v4()
    });

    dispatch(({
      type: TYPES.HEADERS_NEW_SAVING,
      payload: {
        bank: JSON.parse(JSON.stringify(bank)), 
      }
    }));
  }
}

export const updateSavingHeader = (bank: Bank.IBank, header: ISavingsHeader) => {
  return (dispatch: any) => {
    const position = _(bank.headers.savings).map((h: any, i: any) => {
      if (h.id === header.id) return i;
    }).without(undefined).value();

    if (!position.length) return;

    bank.headers.savings[position[0]].$edit = true;
    
    dispatch(({
      type: TYPES.HEADERS_UPDATE_SAVING,
      payload: {
        bank: JSON.parse(JSON.stringify(bank)), 
        header:header
      }
    }));
  };
}

export const confirmUpdateSavingHeader = (bank: Bank.IBank, header: ISavingsHeader) => {
  return (dispatch: any) => {
    _(bank.headers.savings).each((h: any) => {
      if (h.id !== header.id) return;
      h.$edit = false;
      h.label = header.label;
      h.sublabel = header.sublabel;
      h.icon = header.icon;
      h.interest = header.interest;
    });

    dispatch(({
      type: TYPES.HEADERS_UPDATE_SAVING,
      payload: {
        bank: JSON.parse(JSON.stringify(bank)), 
        header:header
      }
    }))
  };
}

export const cancelUpdateSavingHeader = (bank: Bank.IBank, header: ISavingsHeader) => {
  return (dispatch: any) => {
    const position = _(bank.headers.savings).map((h: any, i: any) => {
      if (h.id === header.id) return i;
    }).without(undefined).value();

    if (!position.length) return;

    bank.headers.savings[position[0]].$edit = false;
    
    dispatch(({
      type: TYPES.HEADERS_UPDATE_SAVING,
      payload: {
        bank: JSON.parse(JSON.stringify(bank)), 
        header:header
      }
    }));
  };
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
