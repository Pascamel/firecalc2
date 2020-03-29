import React, { useEffect, useState } from 'react';
import { Alert, Button, Form, FormGroup, Input } from 'reactstrap';

import { auth } from '../../firebase';

export const PasswordForgetForm = () => {
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [email, setEmail] = useState('');

  useEffect(() => {
    if (success) {
      window.setTimeout(() => {
        setSuccess(false);
      }, 4000);
    }
  }, [success]);

  const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    if (!email) return;

    auth
      .doPasswordReset(email)
      .then(() => {
        setSuccess(true);
        setError(null);
        setEmail('');
      })
      .catch(error => {
        setError(error);
      });

    event.preventDefault();
  };

  const isInvalid = email === '';

  return (
    <>
      {error && <Alert color="danger">{error.message}</Alert>}
      {success && <Alert color="success">Password updated successfully!</Alert>}

      <Form onSubmit={onSubmit}>
        <FormGroup>
          <Input
            className="mb-2 mr-sm-2 mb-sm-0"
            type="text"
            placeholder="Email Address"
            value={email}
            onChange={e => setEmail(e.target.value)}
          />
        </FormGroup>
        <FormGroup>
          <Button block disabled={isInvalid} type="submit" color="primary">
            Reset My Password
          </Button>
        </FormGroup>
      </Form>
    </>
  );
};
