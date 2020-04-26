import TYPES from '../actions/types';
import { pushJournal } from '../firebase/firestore';
import { IGenericEvent } from '../store/journal';

const INITIAL_STATE: { lastupdate: number } = {
  lastupdate: new Date().getTime(),
};

const logSimpleEvent = (event: string, label?: string) => {
  pushJournal({
    time: new Date().getTime(),
    event,
    label: label ?? null,
  } as IGenericEvent<null>);
};

const newState = { lastupdate: new Date().getTime() };

const journalReducer = (state = INITIAL_STATE, action: any) => {
  switch (action.type) {
    case TYPES.AUTH_USER_SET:
      logSimpleEvent(TYPES.AUTH_USER_SET);
      return newState;

    // bank loading
    case TYPES.BANK_LOAD_STARTED:
      logSimpleEvent(TYPES.BANK_LOAD_STARTED);
      return newState;
    case TYPES.BANK_LOAD_SUCCESS:
      logSimpleEvent(TYPES.BANK_LOAD_SUCCESS);
      return newState;
    case TYPES.BANK_LOAD_FAILURE:
      logSimpleEvent(TYPES.BANK_LOAD_FAILURE);
      return newState;

    // bank saving
    case TYPES.BANK_SAVE_STARTED:
      logSimpleEvent(TYPES.BANK_SAVE_STARTED);
      return newState;
    case TYPES.BANK_SAVE_SUCCESS:
      logSimpleEvent(TYPES.BANK_SAVE_SUCCESS);
      return newState;
    case TYPES.BANK_SAVE_FAILURE:
      logSimpleEvent(TYPES.BANK_SAVE_FAILURE, action.payload.label);
      return newState;

    // value updating
    case TYPES.BANK_UPDATE_VALUE:
      pushJournal({
        time: new Date().getTime(),
        event: TYPES.BANK_UPDATE_VALUE,
        label: action.payload.label,
        previous_value: action.payload.previous,
        new_value: action.payload.amount,
      } as IGenericEvent<typeof action.payload.amount>);
      return newState;
    case TYPES.BANK_UPDATE_VALUE_LOCAL_STORAGE:
      pushJournal({
        time: new Date().getTime(),
        event: TYPES.BANK_UPDATE_VALUE_LOCAL_STORAGE,
        label: action.payload.label,
        previous_value: action.payload.previous,
        new_value: action.payload.amount,
      } as IGenericEvent<typeof action.payload.amount>);
      return newState;

    // savings header management
    case TYPES.HEADERS_NEW_SAVING:
      return state;
    case TYPES.HEADERS_UPDATE_SAVING:
      logSimpleEvent(TYPES.HEADERS_UPDATE_SAVING, action.payload.label);
      return newState;
    case TYPES.HEADERS_DELETE_SAVING:
      logSimpleEvent(TYPES.HEADERS_DELETE_SAVING, action.payload.label);
      return newState;
    case TYPES.HEADERS_SWITCH_SAVING:
      logSimpleEvent(TYPES.HEADERS_SWITCH_SAVING, action.payload.label);
      return newState;

    // income header management
    case TYPES.HEADERS_NEW_INCOME:
      return state;
    case TYPES.HEADERS_UPDATE_INCOME:
      logSimpleEvent(TYPES.HEADERS_UPDATE_INCOME, action.payload.label);
      return newState;
    case TYPES.HEADERS_DELETE_INCOME:
      logSimpleEvent(TYPES.HEADERS_DELETE_INCOME, action.payload.label);
      return newState;
    case TYPES.HEADERS_SWITCH_INCOME:
      logSimpleEvent(TYPES.HEADERS_SWITCH_INCOME, action.payload.label);
      return newState;

    // expenses header management
    case TYPES.HEADERS_NEW_EXPENSE:
      logSimpleEvent(TYPES.HEADERS_NEW_EXPENSE, action.payload.label);
      return newState;
    case TYPES.HEADERS_UPDATE_EXPENSE:
      logSimpleEvent(TYPES.HEADERS_UPDATE_EXPENSE, action.payload.label);
      return newState;
    case TYPES.HEADERS_DELETE_EXPENSE:
      logSimpleEvent(TYPES.HEADERS_DELETE_EXPENSE, action.payload.label);
      return newState;
    case TYPES.HEADERS_SWITCH_EXPENSE:
      logSimpleEvent(TYPES.HEADERS_SWITCH_EXPENSE, action.payload.label);
      return newState;

    // headers saving
    case TYPES.HEADERS_SAVE_STARTED:
      logSimpleEvent(TYPES.HEADERS_SAVE_STARTED);
      return newState;
    case TYPES.HEADERS_SAVE_SUCCESS:
      logSimpleEvent(TYPES.BANK_SAVE_SUCCESS);
      return newState;
    case TYPES.HEADERS_SAVE_FAILURE:
      logSimpleEvent(TYPES.HEADERS_SAVE_FAILURE);
      return newState;

    default:
      return state;
  }
};

export default journalReducer;
