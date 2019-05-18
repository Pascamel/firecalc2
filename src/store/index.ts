import { applyMiddleware, compose, createStore } from 'redux';
import thunk from 'redux-thunk';

import rootReducer from '../reducers';

const store = createStore(
  rootReducer,
  compose(
    applyMiddleware(thunk),
    ((window as any).__REDUX_DEVTOOLS_EXTENSION__ && (window as any).__REDUX_DEVTOOLS_EXTENSION__()) || compose
  )
);

export default store;

export type AppState = ReturnType<typeof rootReducer>
