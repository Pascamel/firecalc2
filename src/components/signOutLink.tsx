import React from 'react';
import { RouteComponentProps, withRouter } from 'react-router';

import * as ROUTES from '../constants/routes';
import { auth } from '../firebase';

const SignOutLink = (props: RouteComponentProps) => {
  const { history } = props;

  const click = () => {
    auth.doSignOut().then(() => {
      history.push(ROUTES.SIGN_IN);
    })
  }

  return (
    <span onClick={click}>
      Sign Out
    </span>
  );
}

export default withRouter(SignOutLink);
