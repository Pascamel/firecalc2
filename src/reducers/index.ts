import { combineReducers } from 'redux';

import bankReducer from './bank';
import sessionReducer from './session';

const rootReducer = combineReducers({
  sessionState: sessionReducer,
  bankState: bankReducer
});

export default rootReducer;
