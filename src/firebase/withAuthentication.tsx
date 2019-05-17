import React, { Component, Dispatch } from 'react';
import { connect } from 'react-redux';
import  { Alert } from 'reactstrap';

import { LoadingPanel } from '../components';
import { firebase as fb } from '../firebase';

interface IProps {
  authUser?: firebase.User;
  onSetAuthUser: (user: firebase.User|null) => void;
}

interface IState {
  authUser?:   any;
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
      const { onSetAuthUser }: any = this.props;
      fb.auth.onAuthStateChanged(authUser => {
        this.setState({loading: false});
        if (authUser) {
          onSetAuthUser(authUser);
          localStorage.setItem('authUser', JSON.stringify(authUser));
        } else {
          onSetAuthUser(null);
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
    onSetAuthUser: (authUser: any) => dispatch({ type: 'AUTH_USER_SET', authUser })
  });

  return connect(null, mapDispatchToProps)(WithAuthentication);
};
