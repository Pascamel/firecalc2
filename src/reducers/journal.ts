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
      return _appendEvent({
        time: new Date().getTime(),
        event: TYPES.AUTH_USER_SET,
        notSaved: true,
      } as IGenericEvent<null>);

    // bank loading
    case TYPES.BANK_LOAD_STARTED:
      return _appendEvent({
        time: new Date().getTime(),
        event: TYPES.BANK_LOAD_STARTED,
        notSaved: true,
      } as IGenericEvent<null>);
    case TYPES.BANK_LOAD_SUCCESS:
      return _appendEvent({
        time: new Date().getTime(),
        event: TYPES.BANK_LOAD_SUCCESS,
        notSaved: true,
      } as IGenericEvent<null>);
    case TYPES.BANK_LOAD_FAILURE:
      return _appendEvent({
        time: new Date().getTime(),
        event: TYPES.BANK_LOAD_FAILUTRE,
        notSaved: true,
      } as IGenericEvent<null>);

    // bank saving
    case TYPES.BANK_SAVE_STARTED:
      return _appendEvent({
        time: new Date().getTime(),
        event: TYPES.BANK_SAVE_STARTED,
        notSaved: true,
      } as IGenericEvent<null>);
    case TYPES.BANK_SAVE_SUCCESS:
      return _appendEvent({
        time: new Date().getTime(),
        event: TYPES.BANK_SAVE_SUCCESS,
        notSaved: true,
      } as IGenericEvent<null>);
    case TYPES.BANK_SAVE_FAILURE:
      return _appendEvent({
        time: new Date().getTime(),
        event: TYPES.BANK_SAVE_FAILURE,
        label: action.payload.label,
        notSaved: true,
      } as IGenericEvent<null>);

    // value updating
    case TYPES.BANK_UPDATE_VALUE:
      return _appendEvent({
        time: new Date().getTime(),
        event: TYPES.BANK_UPDATE_VALUE,
        label: action.payload.label,
        previous_value: action.payload.previous,
        new_value: action.payload.amount,
        notSaved: true,
      } as IGenericEvent<typeof action.payload.amount>);
    case TYPES.BANK_UPDATE_VALUE_LOCAL_STORAGE:
      return _appendEvent({
        time: new Date().getTime(),
        event: TYPES.BANK_UPDATE_VALUE_LOCAL_STORAGE,
        label: action.payload.label,
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
      return _appendEvent({
        time: new Date().getTime(),
        event: TYPES.HEADERS_SAVE_STARTED,
        notSaved: true,
      } as IGenericEvent<null>);
    case TYPES.HEADERS_SAVE_SUCCESS:
      return _appendEvent({
        time: new Date().getTime(),
        event: TYPES.BANK_SAVE_SUCCESS,
        notSaved: true,
      } as IGenericEvent<null>);
    case TYPES.HEADERS_SAVE_FAILURE:
      return _appendEvent({
        time: new Date().getTime(),
        event: TYPES.HEADERS_SAVE_FAILURE,
        label: action.payload.label,
        notSaved: true,
      } as IGenericEvent<null>);

    // journal loading
    case TYPES.JOURNAL_LOAD_STARTED:
      return _appendEvent({
        time: new Date().getTime(),
        event: TYPES.BANK_LOAD_STARTED,
        notSaved: true,
      } as IGenericEvent<null>);
    case TYPES.JOURNAL_LOAD_SUCCESS:
      return { journal: action.payload.journal };
    case TYPES.JOURNAL_LOAD_FAILURE:
      return { journal: [] };

    // journal saving
    case TYPES.JOURNAL_SAVE_STARTED:
      return state;
    case TYPES.JOURNAL_SAVE_SUCCESS:
      return {
        journal: {
          lastupdate: state.journal.lastupdate,
          events: action.payload.journal.events.map((e: IEvents) => {
            return {
              ...e,
              notSaved: false,
            };
          }),
        },
      };
    case TYPES.JOURNAL_SAVE_FAILURE:
      return { journal: [] };

    default:
      return state;
  }
};

export default journalReducer;
