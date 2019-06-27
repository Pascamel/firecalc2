import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { compose } from 'recompose';

import * as ROUTES from '../constants/routes';
import { firebase as fb } from '../firebase';
import { AppState } from '../store';

interface IProps {
  history?: any,
  authUser: firebase.User
}

export const withAuthorization = (condition: any) => (Component: any) => {
  class WithAuthorization extends React.Component<IProps, {}> {
    listener: any = () => {};

    public componentDidMount() {
      this.listener = fb.auth.onAuthStateChanged(authUser => {
        const authCheckResult = condition(authUser);

        // boolean based authentication
        if (typeof authCheckResult === 'boolean') {
          if (!condition(authUser)) {
            this.props.history.push(ROUTES.NOT_AUTHORIZED);
          }
          
          return;
        } 

        // promise based authentication
        if (typeof authCheckResult === 'object') {
          condition(authUser).then((res: boolean) => {
            if (!res) {
              this.props.history.push(ROUTES.NOT_AUTHORIZED);
            }
          });

          return;
        }

        // unknown auth
        this.props.history.push(ROUTES.HOME);
      });
    }

    public componentWillUnmount() {
      this.listener();
    }

    public render() {
      const { authUser } = this.props;

      return authUser ? <Component {...this.props} /> : null;
    }
  }

  const mapStateToProps = (state: AppState) => ({
    authUser: state.sessionState.authUser,
  });

  return compose(
    withRouter,
    connect(mapStateToProps),
  )(WithAuthorization as any);
};
