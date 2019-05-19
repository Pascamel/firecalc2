import * as TYPES from '../actions/types';

const INITIAL_STATE = {
  authUser: null,
};

function sessionReducer(state = INITIAL_STATE, action: any) {
  switch (action.type) {
    case TYPES.AUTH_USER_SET: {
      return ({
        ...state,
        authUser: action.authUser,
      });
    }
    default:
      return state;
  }
}

export default sessionReducer;
