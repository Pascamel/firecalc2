const INITIAL_STATE = {
  authUser: null,
};

function sessionReducer(state = INITIAL_STATE, action: any) {
  switch (action.type) {
    case 'AUTH_USER_SET': {
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
