import { combineReducers } from 'redux';

import bankReducer from './bank';
import journalReducer from './journal';
import sessionReducer from './session';

const rootReducer = combineReducers({
  journalState: journalReducer,
  sessionState: sessionReducer,
  bankState: bankReducer,
});

export default rootReducer;
