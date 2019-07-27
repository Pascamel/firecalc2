import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from 'reactstrap';

import * as ROUTES from '../../constants/routes';

const PasswordForgotButton = () => (
  <Button block color="light" tag={Link} to={ROUTES.PASSWORD_FORGET}>
    Forgot Password?
  </Button>
);
 
export default PasswordForgotButton;
