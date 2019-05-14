import * as TYPES from '../actions/types';
import _ from 'lodash';
import { DeviceBatteryUnknown } from 'material-ui/svg-icons';


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


    case TYPES.HEADERS_NEW_INCOME:
    case TYPES.HEADERS_UPDATE_INCOME:
    case TYPES.HEADERS_NEW_SAVING:
    case TYPES.HEADERS_UPDATE_SAVING:
      console.log('yo');
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
