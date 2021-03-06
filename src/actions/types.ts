interface IMapping {
  [key: string]: string;
}

const types: Readonly<IMapping> = Object.freeze({
  AUTH_USER_SET: 'AUTH_USER_SET',
  SET_DARK_MODE: 'SET_DARK_MODE',

  BANK_LOAD_STARTED: 'BANK_LOAD_STARTED',
  BANK_LOAD_SUCCESS: 'BANK_LOAD_SUCCESS',
  BANK_LOAD_FAILURE: 'BANK_LOAD_FAILURE',

  BANK_UPDATE_VALUE: 'BANK_UPDATE_VALUE',
  BANK_UPDATE_VALUE_LOCAL_STORAGE: 'BANK_UPDATE_VALUE_LOCAL_STORAGE',

  BANK_SAVE_STARTED: 'BANK_SAVE_STARTED',
  BANK_SAVE_SUCCESS: 'BANK_SAVE_SUCCESS',
  BANK_SAVE_FAILURE: 'BANK_SAVE_FAILURE',

  HEADERS_NEW_SAVING: 'HEADERS_NEW_SAVING',
  HEADERS_UPDATE_SAVING: 'HEADERS_UPDATE_SAVING',
  HEADERS_DELETE_SAVING: 'HEADERS_DELETE_SAVING',
  HEADERS_SWITCH_SAVING: 'HEADERS_SWITCH_SAVING',

  HEADERS_NEW_INCOME: 'HEADERS_NEW_INCOME',
  HEADERS_UPDATE_INCOME: 'HEADERS_UPDATE_INCOME',
  HEADERS_DELETE_INCOME: 'HEADERS_DELETE_INCOME',
  HEADERS_SWITCH_INCOME: 'HEADERS_SWITCH_INCOME',

  HEADERS_NEW_EXPENSE: 'HEADERS_NEW_EXPENSE',
  HEADERS_UPDATE_EXPENSE: 'HEADERS_UPDATE_EXPENSE',
  HEADERS_DELETE_EXPENSE: 'HEADERS_DELETE_EXPENSE',
  HEADERS_SWITCH_EXPENSE: 'HEADERS_SWITCH_EXPENSE',

  HEADERS_SAVE_STARTED: 'HEADERS_SAVE_STARTED',
  HEADERS_SAVE_SUCCESS: 'HEADERS_SAVE_SUCCESS',
  HEADERS_SAVE_FAILURE: 'HEADERS_SAVE_FAILURE',
});

export default types;
