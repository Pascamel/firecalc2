import TYPES from '../actions/types';
import { pushJournal } from '../firebase/firestore';
import { IGenericEvent } from '../store/journal';

const INITIAL_STATE: { lastupdate: number } = {
  lastupdate: new Date().getTime(),
};

const noValueEvent = (event: string, label?: string): IGenericEvent<null> => {
  return {
    time: new Date().getTime(),
    event,
    label: label ?? null,
  } as IGenericEvent<null>;
};

const journalReducer = (state = INITIAL_STATE, action: any) => {
  switch (action.type) {
    case TYPES.AUTH_USER_SET:
      pushJournal(noValueEvent(TYPES.AUTH_USER_SET));
      return { lastupdate: new Date().getTime() };

    // bank loading
    case TYPES.BANK_LOAD_STARTED:
      pushJournal(noValueEvent(TYPES.BANK_LOAD_STARTED));
      return { lastupdate: new Date().getTime() };
    case TYPES.BANK_LOAD_SUCCESS:
      pushJournal(noValueEvent(TYPES.BANK_LOAD_SUCCESS));
      return { lastupdate: new Date().getTime() };
    case TYPES.BANK_LOAD_FAILURE:
      pushJournal(noValueEvent(TYPES.BANK_LOAD_FAILUTRE));
      return { lastupdate: new Date().getTime() };

    // bank saving
    case TYPES.BANK_SAVE_STARTED:
      pushJournal(noValueEvent(TYPES.BANK_SAVE_STARTED));
      return { lastupdate: new Date().getTime() };
    case TYPES.BANK_SAVE_SUCCESS:
      pushJournal(noValueEvent(TYPES.BANK_SAVE_SUCCESS));
      return { lastupdate: new Date().getTime() };
    case TYPES.BANK_SAVE_FAILURE:
      pushJournal(noValueEvent(TYPES.BANK_SAVE_FAILURE, action.payload.label));
      return { lastupdate: new Date().getTime() };

    // value updating
    case TYPES.BANK_UPDATE_VALUE:
      pushJournal({
        time: new Date().getTime(),
        event: TYPES.BANK_UPDATE_VALUE,
        label: action.payload.label,
        previous_value: action.payload.previous,
        new_value: action.payload.amount,
      } as IGenericEvent<typeof action.payload.amount>);
      return { lastupdate: new Date().getTime() };
    case TYPES.BANK_UPDATE_VALUE_LOCAL_STORAGE:
      pushJournal({
        time: new Date().getTime(),
        event: TYPES.BANK_UPDATE_VALUE_LOCAL_STORAGE,
        label: action.payload.label,
        previous_value: action.payload.previous,
        new_value: action.payload.amount,
      } as IGenericEvent<typeof action.payload.amount>);
      return { lastupdate: new Date().getTime() };

    // savings header management
    case TYPES.HEADERS_NEW_SAVING:
      console.log('HEADERS_NEW_SAVING');
      return { lastupdate: new Date().getTime() };
    case TYPES.HEADERS_UPDATE_SAVING:
      console.log('HEADERS_UPDATE_SAVING');
      return { lastupdate: new Date().getTime() };
    case TYPES.HEADERS_DELETE_SAVING:
      console.log('HEADERS_DELETE_SAVING');
      return { lastupdate: new Date().getTime() };
    case TYPES.HEADERS_SWITCH_SAVING:
      console.log('HEADERS_SWITCH_SAVING');
      return { lastupdate: new Date().getTime() };

    // income header management
    case TYPES.HEADERS_NEW_INCOME:
      console.log('HEADERS_NEW_INCOME');
      return { lastupdate: new Date().getTime() };
    case TYPES.HEADERS_UPDATE_INCOME:
      console.log('HEADERS_UPDATE_INCOME');
      return { lastupdate: new Date().getTime() };
    case TYPES.HEADERS_DELETE_INCOME:
      console.log('HEADERS_DELETE_INCOME');
      return { lastupdate: new Date().getTime() };
    case TYPES.HEADERS_SWITCH_INCOME:
      console.log('HEADERS_SWITCH_INCOME');
      return { lastupdate: new Date().getTime() };

    // expenses header management
    case TYPES.HEADERS_NEW_EXPENSE:
      console.log('HEADERS_NEW_EXPENSE');
      return { lastupdate: new Date().getTime() };
    case TYPES.HEADERS_UPDATE_EXPENSE:
      console.log('HEADERS_UPDATE_EXPENSE');
      return { lastupdate: new Date().getTime() };
    case TYPES.HEADERS_DELETE_EXPENSE:
      console.log('HEADERS_DELETE_EXPENSE');
      return { lastupdate: new Date().getTime() };
    case TYPES.HEADERS_SWITCH_EXPENSE:
      console.log('HEADERS_SWITCH_EXPENSE');
      return { lastupdate: new Date().getTime() };

    // headers saving
    case TYPES.HEADERS_SAVE_STARTED:
      pushJournal(noValueEvent(TYPES.HEADERS_SAVE_STARTED));
      return { lastupdate: new Date().getTime() };
    case TYPES.HEADERS_SAVE_SUCCESS:
      pushJournal(noValueEvent(TYPES.BANK_SAVE_SUCCESS));
      return { lastupdate: new Date().getTime() };
    case TYPES.HEADERS_SAVE_FAILURE:
      pushJournal(noValueEvent(TYPES.HEADERS_SAVE_FAILURE));
      return { lastupdate: new Date().getTime() };

    default:
      return state;
  }
};

export default journalReducer;
