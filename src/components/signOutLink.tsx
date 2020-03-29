import React from 'react';
import { RouteComponentProps, withRouter } from 'react-router';

import * as ROUTES from '../constants/routes';
import { auth } from '../firebase';
import Text from './text';

const SignOutLink = (props: RouteComponentProps) => {
  const { history } = props;

  const click = () => {
    auth.doSignOut().then(() => {
      history.push(ROUTES.SIGN_IN);
    });
  };

  return (
    <Text className="no-link" onClick={click}>
      <>
        <i className="fa fa-lg fa-sign-out pr-2" />
        Sign Out
      </>
    </Text>
  );
};

export default withRouter(SignOutLink);
