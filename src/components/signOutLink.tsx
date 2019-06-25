import React from 'react';

import { auth } from '../firebase';

const SignOutLink = () => (
  <span onClick={auth.doSignOut}>
    Sign Out
  </span>
);

export default SignOutLink;
