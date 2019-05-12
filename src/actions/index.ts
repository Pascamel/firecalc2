import {
  LOAD_BANK_STARTED,
  LOAD_BANK_SUCCESS,
  LOAD_BANK_FAILURE
} from './types';

import { Bank } from '../bank';

export const loadBank = (uid: string) => {
  return (dispatch: any) => {
    const bank = new Bank();
    dispatch(loadBankStarted(bank));

    bank.load(uid).then((res: any) => {
      dispatch(loadBankSuccess(bank));
    }).catch((err: any) => {
      dispatch(loadBankFailure(err));
    });
  };
};

const loadBankSuccess = (bank: Bank) => {
  return ({
    type: LOAD_BANK_SUCCESS,
    payload: {bank}
  });
}

const loadBankStarted = (bank: Bank) => {
  return ({
    type: LOAD_BANK_STARTED,
    payload: {bank}
  });
}

const loadBankFailure = (error: any) => {
  return ({
    type: LOAD_BANK_FAILURE,
    payload: {error}
  });
}
