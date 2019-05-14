import * as TYPES from '../actions/types';

const INITIAL_STATE = {
  bank: {},
  bankLoaded: false,
  bankUpdated: false,
  saveInProgress: false
};

function bankReducer(state = INITIAL_STATE, action: any) {
  switch (action.type) {
    case TYPES.BANK_LOAD_STARTED:
      return ({
        ...state,
        bank: action.payload.bank,
        bankLoaded: false
      });
    case TYPES.BANK_LOAD_SUCCESS:
      return ({
        ...state,
        bank: action.payload.bank,
        bankLoaded: true
      });
    case TYPES.BANK_LOAD_FAILURE:
      return ({
        ...state,
        bank: null,
        bankLoaded: false
      });
    case TYPES.BANK_UPDATE_VALUE:
      return ({
        ...state,
        bank: action.payload.bank,  //Object.assign(action.payload.bank),
        bankUpdated: true
      });
    case TYPES.BANK_SAVE_STARTED:
      return ({
        ...state,
        saveInProgress: true
      });
    case TYPES.BANK_SAVE_SUCCESS:
      return ({
        ...state,
        bankUpdated: false,
        saveInProgress: false
      });
    case TYPES.BANK_SAVE_FAILURE:
      return ({
        ...state,
        saveInProgress: false
      });

    default:
      return state;
  }
}

export default bankReducer;
