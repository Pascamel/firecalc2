import { Z_DEFAULT_COMPRESSION } from 'zlib';

import TYPES from '../actions/types';
import deepCopy from '../helpers/deepCopy';
import { IEvent, IEvents, IGenericEvent, IJournal } from '../store/journal';

const INITIAL_STATE: { journal: IJournal } = {
  journal: {
    lastupdate: '',
    events: [],
  },
};

const journalReducer = (state = INITIAL_STATE, action: any) => {
  const _appendEvent = (event: IEvent) => {
    return {
      journal: {
        lastupdate: state.journal.lastupdate,
        events: [...(deepCopy(state.journal.events) as IEvents), event],
      },
    };
  };

  switch (action.type) {
    case TYPES.AUTH_USER_SET:
      console.log('JOURNAL AUTH_USER_SET');
      return _appendEvent({
        time: new Date().getTime(),
        event: TYPES.AUTH_USER_SET,
        notSaved: true,
      } as IGenericEvent<null>);

    // bank loading
    case TYPES.BANK_LOAD_STARTED:
      console.log('JOURNAL BANK_LOAD_STARTED');
      return _appendEvent({
        time: new Date().getTime(),
        event: TYPES.BANK_LOAD_STARTED,
        notSaved: true,
      } as IGenericEvent<null>);

    case TYPES.BANK_LOAD_SUCCESS:
      console.log('JOURNAL BANK_LOAD_SUCCESS');
      return _appendEvent({
        time: new Date().getTime(),
        event: TYPES.BANK_LOAD_SUCCESS,
        notSaved: true,
      } as IGenericEvent<null>);

    case TYPES.BANK_LOAD_FAILURE:
      console.log('BANK_LOAD_FAILURE');
      return _appendEvent({
        time: new Date().getTime(),
        event: TYPES.BANK_LOAD_FAILUTRE,
        notSaved: true,
      } as IGenericEvent<null>);

    // bank saving
    case TYPES.BANK_SAVE_STARTED:
      console.log('BANK_SAVE_STARTED');
      return _appendEvent({
        time: new Date().getTime(),
        event: TYPES.BANK_SAVE_STARTED,
        notSaved: true,
      } as IGenericEvent<null>);
    case TYPES.BANK_SAVE_SUCCESS:
      console.log('BANK_SAVE_SUCCESS');
      return _appendEvent({
        time: new Date().getTime(),
        event: TYPES.BANK_SAVE_SUCCESS,
        notSaved: true,
      } as IGenericEvent<null>);
    case TYPES.BANK_SAVE_FAILURE:
      console.log('BANK_SAVE_FAILURE');
      return _appendEvent({
        time: new Date().getTime(),
        event: TYPES.BANK_SAVE_FAILURE,
        notSaved: true,
      } as IGenericEvent<null>);

    // value updating
    case TYPES.BANK_UPDATE_VALUE:
      console.log('BANK_UPDATE_VALUE', action.payload);
      return _appendEvent({
        time: new Date().getTime(),
        event: TYPES.BANK_UPDATE_VALUE,
        previous_value: action.payload.previous,
        new_value: action.payload.amount,
        notSaved: true,
      } as IGenericEvent<typeof action.payload.amount>);
    case TYPES.BANK_UPDATE_VALUE_LOCAL_STORAGE:
      console.log('BANK_UPDATE_VALUE_LOCAL_STORAGE', action.payload);
      return _appendEvent({
        time: new Date().getTime(),
        event: TYPES.BANK_UPDATE_VALUE_LOCAL_STORAGE,
        previous_value: action.payload.previous,
        new_value: action.payload.amount,
        notSaved: true,
      } as IGenericEvent<typeof action.payload.amount>);

    // savings header management
    case TYPES.HEADERS_NEW_SAVING:
      console.log('HEADERS_NEW_SAVING');
      return state;
    case TYPES.HEADERS_UPDATE_SAVING:
      console.log('HEADERS_UPDATE_SAVING');
      return state;
    case TYPES.HEADERS_DELETE_SAVING:
      console.log('HEADERS_DELETE_SAVING');
      return state;
    case TYPES.HEADERS_SWITCH_SAVING:
      console.log('HEADERS_SWITCH_SAVING');
      return state;

    // income header management
    case TYPES.HEADERS_NEW_INCOME:
      console.log('HEADERS_NEW_INCOME');
      return state;
    case TYPES.HEADERS_UPDATE_INCOME:
      console.log('HEADERS_UPDATE_INCOME');
      return state;
    case TYPES.HEADERS_DELETE_INCOME:
      console.log('HEADERS_DELETE_INCOME');
      return state;
    case TYPES.HEADERS_SWITCH_INCOME:
      console.log('HEADERS_SWITCH_INCOME');
      return state;

    // expenses header management
    case TYPES.HEADERS_NEW_EXPENSE:
      console.log('HEADERS_NEW_EXPENSE');
      return state;
    case TYPES.HEADERS_UPDATE_EXPENSE:
      console.log('HEADERS_UPDATE_EXPENSE');
      return state;
    case TYPES.HEADERS_DELETE_EXPENSE:
      console.log('HEADERS_DELETE_EXPENSE');
      return state;
    case TYPES.HEADERS_SWITCH_EXPENSE:
      console.log('HEADERS_SWITCH_EXPENSE');
      return state;

    // headers saving
    case TYPES.HEADERS_SAVE_STARTED:
      console.log('HEADERS_SAVE_STARTED');
      return state;
    case TYPES.HEADERS_SAVE_SUCCESS:
      console.log('HEADERS_SAVE_SUCCESS');
      return state;
    case TYPES.HEADERS_SAVE_FAILURE:
      console.log('HEADERS_SAVE_FAILURE');
      return state;

    default:
      return state;
  }
};

export default journalReducer;
