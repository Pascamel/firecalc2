import * as TYPES from '../actions/types';

const INITIAL_STATE = {
  authUser: null,
  darkMode: null
};

const sessionReducer = (state = INITIAL_STATE, action: any) => {
  switch (action.type) {
    case TYPES.AUTH_USER_SET: {
      return {
        ...state,
        authUser: action.authUser
      };
    }
    case TYPES.SET_DARK_MODE:
      return {
        ...state,
        darkMode: action.payload.darkMode
      };
    default:
      return state;
  }
};

export default sessionReducer;
