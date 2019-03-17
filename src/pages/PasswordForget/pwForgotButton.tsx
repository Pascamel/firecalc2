import * as React from 'react';
import { Button } from 'reactstrap';
import { Link } from 'react-router-dom';
import * as ROUTES from '../../constants/routes';


export default class PasswordForgotButton extends React.Component<{}, {}> {
  render () {
    return (
      <Button block color="light" tag={Link} to={ROUTES.PASSWORD_FORGET}>
        Forgot Password?
      </Button>
    );
  }
}
 