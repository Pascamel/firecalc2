import * as React from 'react';
import { Button } from 'reactstrap';
import { PasswordForgetForm } from './PasswordForgetForm';


export const PasswordForget = () => (
  <div>
    <h1>PasswordForget</h1>
    <PasswordForgetForm />
  </div>
);

export const PasswordForgetButton = () => (
  <Button block color="light">
    Forgot Password?
  </Button>
);
