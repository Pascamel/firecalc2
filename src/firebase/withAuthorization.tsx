import * as React from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { compose } from 'recompose';
import * as ROUTES from '../constants/routes';
import { firebase } from '../firebase';
import { AppState } from '../store';


interface IProps {
  history?: any,
  authUser: any
}

export const withAuthorization = (condition: any) => (Component: any) => {
  class WithAuthorization extends React.Component<IProps, {}> {
    listener: any = () => {};

    public componentDidMount() {
      this.listener = firebase.auth.onAuthStateChanged(authUser => {
        if (!condition(authUser)) {
          this.props.history.push(ROUTES.SIGN_IN);
        }
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
