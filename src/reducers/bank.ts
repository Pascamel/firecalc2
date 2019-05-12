import { Bank } from "../bank";

const INITIAL_STATE = {
  bank: {},
  bankLoaded: false
};

function bankReducer(state = INITIAL_STATE, action: any) {
  switch (action.type) {
    case 'LOAD_BANK_STARTED':
      return ({
        ...state,
        bank: action.payload.bank
      });
    case 'LOAD_BANK_SUCCESS':
      return ({
        ...state,
        bank: action.payload.bank,
        bankLoaded: true
      });
    case 'LOAD_BANK_FAILURE':
      return ({
        ...state,
        bank: null,
        bankLoaded: false
      });
    default:
      return state;
  }
}

export default bankReducer;
