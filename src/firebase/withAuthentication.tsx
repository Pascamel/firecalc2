import React, { Component, Dispatch } from 'react';
import { connect } from 'react-redux';
import  { Alert } from 'reactstrap';

import { unloadBank } from '../actions';
import * as TYPES from '../actions/types';
import { LoadingPanel } from '../components';
import { firebase as fb } from '../firebase';

interface IProps {
  authUser?: firebase.User;
  onSetAuthUser: (user: firebase.User|null) => void;
  onUnloadBank: () => void;
}

interface IState {
  authUser?: firebase.User|null;
  loading: boolean;
}

export const withAuthentication = (WrappedComponent: any) => {
  class WithAuthentication extends Component<IProps, IState> {
    constructor(props: IProps) {
      super(props);

      const ls = localStorage.getItem('authUser') || '';
      this.props.onSetAuthUser(ls.length ? JSON.parse(ls) : null);

      this.state = {
        loading: true
      };
    }

    public componentDidMount() {
      fb.auth.onAuthStateChanged(authUser => {
        this.setState({loading: false});
        if (authUser) {
          this.props.onSetAuthUser(authUser);
          localStorage.setItem('authUser', JSON.stringify(authUser));
        } else {
          this.props.onSetAuthUser(null);
          this.props.onUnloadBank();
          localStorage.removeItem('authUser');
        }
      });
    }

    public render() {
      if (this.state.loading) return (
        <Alert color="background" className="pre-loading">
          <LoadingPanel color="background" />
        </Alert>
      );

      return <WrappedComponent {...this.props} />;
    }  
  }

  const mapDispatchToProps = (dispatch: Dispatch<any>) => ({
    onSetAuthUser: (authUser: any) => dispatch({ 
      type: TYPES.AUTH_USER_SET, 
      authUser 
    }),
    onUnloadBank: () => dispatch(unloadBank())
  });

  return connect(null, mapDispatchToProps)(WithAuthentication);
};
