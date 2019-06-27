import _ from 'lodash';
import uuid from 'uuid';

import * as TYPES from '../actions/types';
import Bank from '../bank';
import { IBank } from '../bank/bank';

const INITIAL_STATE = {
  bank: {},
  bankLoaded: false,
  bankSavingsUpdated: false,
  bankIncomeUpdated: false,
  bankOthersUpdated: false,
  bankHeadersUpdated: false,
  saveInProgress: false
};

const bankReducer = (state = INITIAL_STATE, action: any) => {
  switch (action.type) {
    case TYPES.BANK_LOAD_STARTED:
      return ({
        ...state,
        bank: action.payload.bank,
        bankSavingsUpdated: false,
        bankIncomeUpdated: false,
        bankOthersUpdated: false,
        bankHeadersUpdated: false,
        bankLoaded: false
      });
      
    case TYPES.BANK_LOAD_SUCCESS:
      return ({
        ...state,
        bank: action.payload.bank,
        bankSavingsUpdated: false,
        bankIncomeUpdated: false,
        bankOthersUpdated: false,
        bankHeadersUpdated: false,
        bankLoaded: true
      });

    case TYPES.BANK_LOAD_FAILURE:
      return ({
        ...state,
        bank: null,
        bankSavingsUpdated: false,
        bankIncomeUpdated: false,
        bankOthersUpdated: false,
        bankHeadersUpdated: false,
        bankLoaded: false
      });

    case TYPES.BANK_UPDATE_VALUE: {
      let new_bank = JSON.parse(JSON.stringify(state.bank));
      
      Bank.updateValue(new_bank, action.payload.index, action.payload.indexes, action.payload.amount);
      Bank.calculateTotals(new_bank);
      
      return ({
        ...state,
        bank: new_bank,
        bankSavingsUpdated: (action.payload.index === 'savings'),
        bankIncomeUpdated: (action.payload.index === 'income'),
        bankOthersUpdated: (action.payload.index === 'networth' || action.payload.index === 'expenses'),
        bankHeadersUpdated: (action.payload.index === 'headers')
      });
    }

    case TYPES.BANK_UPDATE_VALUE_LOCAL_STORAGE: {
      let new_bank = JSON.parse(JSON.stringify(state.bank));

      Bank.updateValue(new_bank, action.payload.index, action.payload.indexes, action.payload.amount);
      Bank.saveLocalStorage(new_bank);

      return ({
        ...state,
        bank: new_bank
      });
    }

    case TYPES.BANK_SAVE_STARTED:
    case TYPES.HEADERS_SAVE_STARTED:
      return ({
        ...state,
        saveInProgress: true
      });

    case TYPES.BANK_SAVE_SUCCESS:
      return ({
        ...state,
        bankSavingsUpdated: false,
        bankIncomeUpdated: false,
        bankOthersUpdated: false,
        bankHeadersUpdated: false,
        saveInProgress: false
      });

    case TYPES.HEADERS_SAVE_SUCCESS:
      return ({
        ...state,
        bankHeadersUpdated: false,
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
        bankHeadersUpdated: true
      });
    }
      
    case TYPES.HEADERS_UPDATE_SAVING: {
      let new_bank: IBank = JSON.parse(JSON.stringify(state.bank));

      _(new_bank.headers.savings).each((h) => {
        if (h.id !== action.payload.header.id) return;
        Object.assign(h, action.payload.header);
      });

      return ({
        ...state,
        bank: new_bank,
        bankHeadersUpdated: true
      });
    }

    case TYPES.HEADERS_DELETE_SAVING: {
      let new_bank = JSON.parse(JSON.stringify(state.bank));
      _.remove(new_bank.headers.savings, (h: any) => h.id === action.payload.header.id);

      return({
        ...state,
        bank: new_bank,
        bankHeadersUpdated: true
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
        bankHeadersUpdated: true
      });
    }

    case TYPES.HEADERS_NEW_INCOME: {
      let new_bank = JSON.parse(JSON.stringify(state.bank));
      new_bank.headers.incomes.push({
        $edit: true,
        id: uuid.v4()
      });

      return ({
        ...state,
        bank: new_bank,
        bankHeadersUpdated: true
      });
    }
    
    case TYPES.HEADERS_UPDATE_INCOME: {
      let new_bank = JSON.parse(JSON.stringify(state.bank));

      _(new_bank.headers.incomes).each((h: any) => {
        if (h.id !== action.payload.header.id) return;
        Object.assign(h, action.payload.header);
      });

      return ({
        ...state,
        bank: new_bank,
        bankHeadersUpdated: true
      });
    }

    case TYPES.HEADERS_DELETE_INCOME: {
      let new_bank = JSON.parse(JSON.stringify(state.bank));
      _.remove(new_bank.headers.incomes, (h: any) => h.id === action.payload.header.id);

      return({
        ...state,
        bank: new_bank,
        bankHeadersUpdated: true
      });
    }
    
    case TYPES.HEADERS_SWITCH_INCOME: {
      let new_bank = JSON.parse(JSON.stringify(state.bank));

      let tmp = new_bank.headers.incomes[action.payload.index1];	
      new_bank.headers.incomes[action.payload.index1] = new_bank.headers.incomes[action.payload.index2];	
      new_bank.headers.incomes[action.payload.index2] = tmp;	

      return({
        ...state,
        bank: new_bank,
        bankHeadersUpdated: true
      });
    }
    default:
      return state;
  }
}

export default bankReducer;
