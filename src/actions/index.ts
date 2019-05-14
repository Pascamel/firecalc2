import * as TYPES from './types';
import * as Bank from '../bank';
import _ from 'lodash';


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


export const updateValue = (bank: Bank.IBank, index: string, indexes: string[], amount: number) => {
  return (dispatch: any) => {

    Bank.updateValue(bank, index, indexes, amount);
    Bank.calculateTotals(bank);
    
    dispatch(({
      type: TYPES.BANK_UPDATE_VALUE,
      payload: {bank}
    }));
  }
}

export const saveBank = (bank: Bank.IBank, uid: string) => {
  return (dispatch: any) => {
    dispatch(({
      type: TYPES.BANK_SAVE_STARTED,
      payload: {bank}
    }));

    Bank.saveSavings(bank).then(() => {
      Bank.saveIncome(bank).then(() => {
        Bank.saveNetWorth(bank).then(() => {
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
};
