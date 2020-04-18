import { Dispatch } from 'redux';

import Bank from '../bank';
import { IIncomeHeader, ISavingsHeader } from '../bank/interfaces';
import { deepCopy } from '../helpers';
import * as TYPES from './types';

export const loadBank = (uid: string) => {
  return (dispatch: Dispatch<any>) => {
    const bank = {};
    dispatch({
      type: TYPES.BANK_LOAD_STARTED,
      payload: { bank }
    });

    Bank.load(uid)
      .then((bank: Bank.IBank) => {
        dispatch({
          type: TYPES.BANK_LOAD_SUCCESS,
          payload: { bank }
        });
      })
      .catch((error: Error) => {
        dispatch({
          type: TYPES.BANK_LOAD_FAILURE,
          payload: { error }
        });
      });
  };
};

export const unloadBank = () => {
  return (dispatch: Dispatch<any>) => {
    const bank = {};
    dispatch({
      type: TYPES.BANK_LOAD_STARTED,
      payload: { bank }
    });
  };
};

export const updateValue = (
  index: string,
  indexes: string[],
  amount: number | boolean | string
) => {
  return (dispatch: Dispatch<any>) => {
    dispatch({
      type: TYPES.BANK_UPDATE_VALUE,
      payload: { index, indexes, amount }
    });
  };
};

export const updateValueLocalStorage = (
  index: string,
  indexes: string[],
  amount: number | boolean
) => {
  return (dispatch: Dispatch<any>) => {
    dispatch({
      type: TYPES.BANK_UPDATE_VALUE_LOCAL_STORAGE,
      payload: { index, indexes, amount }
    });
  };
};

export const saveBank = (
  uid: string,
  bank: Bank.IBank,
  savings: boolean,
  income: boolean,
  settings: boolean
) => {
  return (dispatch: Dispatch<any>) => {
    dispatch({
      type: TYPES.BANK_SAVE_STARTED,
      payload: { bank }
    });

    const promises = [];
    if (savings) promises.push(Bank.saveSavings(uid, bank));
    if (income) promises.push(Bank.saveIncome(uid, bank));
    if (settings) promises.push(Bank.saveOthers(uid, bank));

    Promise.all(promises)
      .then(() => {
        dispatch({
          type: TYPES.BANK_SAVE_SUCCESS,
          payload: {
            bank: deepCopy(bank)
          }
        });
      })
      .catch((error: Error) => {
        dispatch({
          type: TYPES.BANK_SAVE_FAILURE,
          payload: { error }
        });
      });
  };
};

export const newSavingHeader = () => {
  return (dispatch: Dispatch<any>) => {
    dispatch({
      type: TYPES.HEADERS_NEW_SAVING,
      payload: {}
    });
  };
};

export const updateSavingHeader = (header: ISavingsHeader) => {
  return (dispatch: Dispatch<any>) => {
    dispatch({
      type: TYPES.HEADERS_UPDATE_SAVING,
      payload: {
        header: {
          id: header.id,
          label: header.label,
          sublabel: header.sublabel,
          icon: header.icon,
          interest: header.interest,
          displayFrom: header.displayFrom,
          displayFromMonth: header.displayFromMonth,
          displayFromYear: header.displayFromYear,
          displayTo: header.displayTo,
          displayToMonth: header.displayToMonth,
          displayToYear: header.displayToYear
        }
      }
    });
  };
};

export const confirmUpdateSavingHeader = (header: ISavingsHeader) => {
  return (dispatch: Dispatch<any>) => {
    dispatch({
      type: TYPES.HEADERS_UPDATE_SAVING,
      payload: {
        header: {
          id: header.id,
          label: header.label,
          sublabel: header.sublabel,
          icon: header.icon,
          interest: header.interest,
          displayFrom: header.displayFrom,
          displayFromMonth: header.displayFromMonth,
          displayFromYear: header.displayFromYear,
          displayTo: header.displayTo,
          displayToMonth: header.displayToMonth,
          displayToYear: header.displayToYear
        }
      }
    });
  };
};

export const cancelUpdateSavingHeader = (header: ISavingsHeader) => {
  return (dispatch: Dispatch<any>) => {
    dispatch({
      type: TYPES.HEADERS_UPDATE_SAVING,
      payload: {
        header: {
          id: header.id
        }
      }
    });
  };
};

export const deleteSavingHeader = (header: ISavingsHeader) => {
  return (dispatch: Dispatch<any>) => {
    dispatch({
      type: TYPES.HEADERS_DELETE_SAVING,
      payload: {
        header: {
          id: header.id
        }
      }
    });
  };
};

export const switchSavingHeaders = (index1: number, index2: number) => {
  return (dispatch: Dispatch<any>) => {
    dispatch({
      type: TYPES.HEADERS_SWITCH_SAVING,
      payload: {
        index1: index1,
        index2: index2
      }
    });
  };
};

export const newIncomeHeader = () => {
  return (dispatch: Dispatch<any>) => {
    dispatch({
      type: TYPES.HEADERS_NEW_INCOME,
      payload: {}
    });
  };
};

export const updateIncomeHeader = (header: IIncomeHeader) => {
  return (dispatch: Dispatch<any>) => {
    dispatch({
      type: TYPES.HEADERS_UPDATE_INCOME,
      payload: {
        header: {
          id: header.id,
          label: header.label,
          pretax: header.pretax,
          count: header.count
        }
      }
    });
  };
};

export const deleteIncomeHeader = (header: IIncomeHeader) => {
  return (dispatch: Dispatch<any>) => {
    dispatch({
      type: TYPES.HEADERS_DELETE_INCOME,
      payload: {
        header: {
          id: header.id
        }
      }
    });
  };
};

export const switchIncomeHeaders = (index1: number, index2: number) => {
  return (dispatch: Dispatch<any>) => {
    dispatch({
      type: TYPES.HEADERS_SWITCH_INCOME,
      payload: {
        index1: index1,
        index2: index2
      }
    });
  };
};

export const saveHeaders = (uid: string, bank: Bank.IBank) => {
  return (dispatch: Dispatch<any>) => {
    dispatch({
      type: TYPES.HEADERS_SAVE_STARTED,
      payload: { bank }
    });

    Bank.saveHeaders(uid, bank)
      .then(() => {
        dispatch({
          type: TYPES.HEADERS_SAVE_SUCCESS,
          payload: { bank }
        });
      })
      .catch((error: Error) => {
        dispatch({
          type: TYPES.HEADERS_SAVE_FAILURE,
          payload: { error }
        });
      });
  };
};

export const setDarkMode = (darkMode: boolean) => {
  return (dispatch: Dispatch<any>) => {
    dispatch({
      type: TYPES.SET_DARK_MODE,
      payload: { darkMode }
    });
  };
};
