import * as React from "react";
import { withRouter } from "react-router-dom";
import * as routes from "../constants/routes";
import { firebase } from '../firebase';
import { AuthUserContext } from "./AuthUserContext";

interface IProps {
  history?: any;
}

export const withAuthorization = (condition: any) => (Component: any) => {
  class WithAuthorization extends React.Component<IProps, {}> {
    listener: any = () => {};

    public componentDidMount() {
      this.listener = firebase.auth.onAuthStateChanged(authUser => {
        if (!condition(authUser)) {
          this.props.history.push(routes.SIGN_IN);
        }
      });
    }

    public componentWillUnmount() {
      this.listener();
    }

    public render() {
      return (
        <AuthUserContext.Consumer>
          {authUser => (authUser ? <Component {...this.props} /> : null)}
        </AuthUserContext.Consumer>
      );
    }
  }

  return withRouter(WithAuthorization as any);
};
