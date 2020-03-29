import React, { useState } from 'react';
import { RouteComponentProps } from 'react-router';
import { Alert, Button, Form, FormGroup, Input } from 'reactstrap';

import * as ROLES from '../../constants/roles';
import * as ROUTES from '../../constants/routes';
import { auth, firestore } from '../../firebase';

export const SignUpForm = (props: RouteComponentProps) => {
  const [email, setEmail] = useState('');
  const [passwordOne, setPasswordOne] = useState('');
  const [passwordTwo, setPasswordTwo] = useState('');
  const [error, setError] = useState<Error | null>(null);

  const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    auth
      .doCreateUserWithEmailAndPassword(email, passwordOne)
      .then((authUser: firebase.auth.UserCredential) => {
        if (authUser.user) {
          return firestore.setUser(authUser.user.uid, {
            email,
            type: ROLES.USER
          });
        }
      })
      .then(() => {
        setError(null);
        setPasswordOne('');
        setPasswordTwo('');
        props.history.push(ROUTES.HOME);
      })
      .catch(error => {
        setError(error);
      });
  };

  const isInvalid =
    passwordOne !== passwordTwo || passwordOne === '' || email === '';

  return (
    <Form onSubmit={onSubmit}>
      <FormGroup className="mt-2">
        <Input
          value={email}
          onChange={e => setEmail(e.target.value)}
          type="text"
          placeholder="Email Address"
        />
      </FormGroup>
      <FormGroup>
        <Input
          value={passwordOne}
          onChange={e => setPasswordOne(e.target.value)}
          type="password"
          placeholder="Password"
        />
      </FormGroup>
      <FormGroup>
        <Input
          value={passwordTwo}
          onChange={event => setPasswordTwo(event.target.value)}
          type="password"
          placeholder="Confirm Password"
        />
      </FormGroup>
      <FormGroup>
        <Button block color="primary" disabled={isInvalid} type="submit">
          Sign Up
        </Button>
      </FormGroup>

      {error && <Alert color="danger">{error.message}</Alert>}
    </Form>
  );
};
