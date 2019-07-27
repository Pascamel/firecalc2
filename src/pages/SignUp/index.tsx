import React from 'react';
import { Link, withRouter } from 'react-router-dom';
import { Button } from 'reactstrap';

import * as ROUTES from '../../constants/routes';
import { SignUpPage } from './signUpPage'

export const SignUpButton = () => (
  <Button block tag={Link} to={ROUTES.SIGN_UP} color="link">
    Don't have an account? Sign Up!
  </Button>
);

export const SignUp = withRouter(SignUpPage);
