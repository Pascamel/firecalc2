import React, { useEffect, useState } from 'react';
import { Alert, Button, Form, Input } from 'reactstrap';

import { auth } from '../../firebase';

export const PasswordChangeForm = () => {
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [passwordOne, setPasswordOne] = useState('');
  const [passwordTwo, setPasswordTwo] = useState('');

  useEffect(() => {
    if (success) {
      window.setTimeout(() => {
        setSuccess(false);
      }, 4000);
    }
  }, [success]);

  const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    if (!passwordOne) return;

    auth
      .doPasswordUpdate(passwordOne)
      .then(() => {
        setSuccess(true);
        setError(null);
        setPasswordOne('');
        setPasswordTwo('');
      })
      .catch(error => {
        setError(error);
      });

    event.preventDefault();
  };

  const isInvalid = passwordOne !== passwordTwo || passwordOne === '';

  return (
    <>
      {error && <Alert color="danger">{error.message}</Alert>}
      {success && <Alert color="success">Password updated successfully!</Alert>}

      <Form inline={true} onSubmit={onSubmit}>
        <Input
          className="mb-2 mr-sm-2 mb-sm-0"
          type="password"
          placeholder="New Password"
          value={passwordOne}
          onChange={event => setPasswordOne(event.target.value)}
        />
        <Input
          className="mb-2 mr-sm-2 mb-sm-0"
          type="password"
          placeholder="Confirm New Password"
          value={passwordTwo}
          onChange={event => setPasswordTwo(event.target.value)}
        />
        <Button disabled={isInvalid} type="submit">
          Change My Password
        </Button>
      </Form>
    </>
  );
};
