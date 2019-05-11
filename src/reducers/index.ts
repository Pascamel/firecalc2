import { combineReducers } from 'redux';
import sessionReducer from './session';
import bankReducer from './bank';


const rootReducer = combineReducers({
  sessionState: sessionReducer,
  userState: bankReducer
});

export default rootReducer;
