import React, { useEffect, useState } from 'react';
import { RouteComponentProps } from 'react-router';
import {
    Alert, Button, Form, FormGroup, Input, InputGroup, InputGroupAddon, InputGroupText
} from 'reactstrap';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import ROUTES from '../../constants/routes';
import { auth } from '../../firebase';

export const SignInForm = ({ history }: RouteComponentProps) => {
  const [error, setError] = useState<Error | null>(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  useEffect(() => {
    if (error) {
      window.setTimeout(() => {
        setError(null);
      }, 4000);
    }
  }, [error]);

  const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    auth
      .doSignInWithEmailAndPassword(email, password)
      .then(() => {
        setError(null);
        setEmail('');
        setPassword('');
        history.push(ROUTES.HOME);
      })
      .catch((error) => {
        setError(error);
      });

    event.preventDefault();
  };

  const isInvalid = password === '' || email === '';

  return (
    <>
      <Form onSubmit={onSubmit}>
        <FormGroup>
          <InputGroup className="mt-2">
            <InputGroupAddon addonType="prepend">
              <InputGroupText>
                <FontAwesomeIcon icon={['far', 'user']} />
              </InputGroupText>
            </InputGroupAddon>
            <Input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              type="text"
              placeholder="Email Address"
            />
          </InputGroup>
        </FormGroup>
        <FormGroup>
          <InputGroup>
            <InputGroupAddon addonType="prepend">
              <InputGroupText>
                <FontAwesomeIcon icon="unlock-alt" />
              </InputGroupText>
            </InputGroupAddon>
            <Input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type="password"
              placeholder="Password"
            />
          </InputGroup>
        </FormGroup>
        <FormGroup>
          <Button
            color="primary"
            block={true}
            disabled={isInvalid}
            type="submit"
          >
            Sign In
          </Button>
        </FormGroup>
      </Form>

      {error && <Alert color="danger">{error.message}</Alert>}
    </>
  );
};
