import * as TYPES from '../actions/types';
import _ from 'lodash';
import uuid from 'uuid';


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
        bankUpdated: false,
        bankLoaded: false
      });
    case TYPES.BANK_LOAD_SUCCESS:
      return ({
        ...state,
        bank: action.payload.bank,
        bankUpdated: false,
        bankLoaded: true
      });
    case TYPES.BANK_LOAD_FAILURE:
      return ({
        ...state,
        bank: null,
        bankUpdated: false,
        bankLoaded: false
      });
    case TYPES.BANK_UPDATE_VALUE:
      return ({
        ...state,
        bank: action.payload.bank,
        bankUpdated: true
      });
    case TYPES.BANK_SAVE_STARTED:
    case TYPES.HEADERS_SAVE_STARTED:
      return ({
        ...state,
        saveInProgress: true
      });
    case TYPES.BANK_SAVE_SUCCESS:
    case TYPES.HEADERS_SAVE_SUCCESS:
      return ({
        ...state,
        bankUpdated: false,
        saveInProgress: false
      });
    case TYPES.BANK_SAVE_FAILURE:
    case TYPES.HEADERS_SAVE_FAILURE:
      return ({
        ...state,
        saveInProgress: false
      });

    case TYPES.HEADERS_NEW_SAVING: {
      let new_bank = JSON.parse(JSON.stringify(state.bank));
      new_bank.headers.savings.push({
        $edit: true,
        id: uuid.v4()
      });

      return ({
        ...state,
        bank: new_bank,
        bankUpdated: true
      });
    }
      
    case TYPES.HEADERS_UPDATE_SAVING: {
      let new_bank = JSON.parse(JSON.stringify(state.bank));

      _(new_bank.headers.savings).each((h: any) => {
        if (h.id !== action.payload.header.id) return;
        Object.assign(h, action.payload.header);
      });

      return ({
        ...state,
        bank: new_bank,
        bankUpdated: true
      });
    }

    case TYPES.HEADERS_DELETE_SAVING: {
      let new_bank = JSON.parse(JSON.stringify(state.bank));
      _.remove(new_bank.headers.savings, (h: any) => h.id === action.payload.header.id);

      return({
        ...state,
        bank: new_bank,
        bankUpdated: true
      });
    }
    case TYPES.HEADERS_SWITCH_SAVING: {
      let new_bank = JSON.parse(JSON.stringify(state.bank));

      var tmp = new_bank.headers.savings[action.payload.index1];	
      new_bank.headers.savings[action.payload.index1] = new_bank.headers.savings[action.payload.index2];	
      new_bank.headers.savings[action.payload.index2] = tmp;	

      return({
        ...state,
        bank: new_bank,
        bankUpdated: true
      });
    }

    case TYPES.HEADERS_NEW_INCOME:
    case TYPES.HEADERS_UPDATE_INCOME:
      return ({
        ...state,
        bank: action.payload.bank,
        bankUpdated: true
      });
    default:
      return state;
  }
}

export default bankReducer;
