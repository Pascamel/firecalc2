import * as React from 'react';
import { Button} from 'reactstrap';
import { Link, withRouter } from 'react-router-dom';
import { SignUpPage } from './signUpPage'
import * as ROUTES from '../../constants/routes';


export const SignUpButton = () => (
  <Button block tag={Link} to={ROUTES.SIGN_UP} color="link">
    Don't have an account? Sign Up!
  </Button>
);

export const SignUp = withRouter(SignUpPage);
