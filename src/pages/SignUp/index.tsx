import * as React from 'react';
import { Link, withRouter } from 'react-router-dom';
import { SignUpPage } from './signUpPage'
import * as ROUTES from '../../constants/routes';


export const SignUpLink = () => (
  <span>
    Don't have an account? <Link to={ROUTES.SIGN_UP}>Sign Up</Link>
  </span>
);


// export const SignUpLink = SignUpLink;
export const SignUp = withRouter(SignUpPage);
