import * as React from "react";
import { auth } from "../firebase";

export const SignOutLink = () => (
  <span onClick={auth.doSignOut}>
    Sign Out
  </span>
);

