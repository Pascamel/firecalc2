const INITIAL_STATE = {
  users: null,
};

const applySetUsers = (state: any, action: any) => ({
  ...state,
  users: action.users,
});

const applySetUser = (state: any, action: any) => ({
  ...state,
  users: {
    ...state.users,
    [action.uid]: action.user,
  },
});

function bankReducer(state = INITIAL_STATE, action: any) {
  switch (action.type) {
    case 'USERS_SET': {
      return applySetUsers(state, action);
    }
    case 'USER_SET': {
      return applySetUser(state, action);
    }
    default:
      return state;
  }
}

export default bankReducer;
