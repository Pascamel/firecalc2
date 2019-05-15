import * as React from 'react';
import { Link } from 'react-router-dom';
import { Button } from 'reactstrap';

import * as ROUTES from '../../constants/routes';

export default class PasswordForgotButton extends React.Component<{}, {}> {
  render() {
    return (
      <Button block color="light" tag={Link} to={ROUTES.PASSWORD_FORGET}>
        Forgot Password?
      </Button>
    );
  }
}
 