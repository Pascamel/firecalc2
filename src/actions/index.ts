import * as TYPES from './types';
import { Bank } from '../bank';

export const loadBank = (uid: string) => {
  return (dispatch: any) => {
    const bank = new Bank();
    dispatch(({
      type: TYPES.BANK_LOAD_STARTED,
      payload: {bank}
    }));

    bank.load(uid).then((res: any) => {
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


export const updateValue = (bank: Bank, index: string, indexes: string[], amount: number) => {
  bank.updateValue(index, indexes, amount);

  return (dispatch: any) => {
    dispatch(({
      type: TYPES.BANK_UPDATE_VALUE,
      payload: {bank}
    }));
  }
}

export const saveBank = (bank: Bank, uid: string) => {
  return (dispatch: any) => {
    dispatch(({
      type: TYPES.BANK_SAVE_STARTED,
      payload: {bank}
    }));

    bank.saveSavings().then(() => {
      bank.saveIncome().then(() => {
        bank.saveNetWorth().then(() => {
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
