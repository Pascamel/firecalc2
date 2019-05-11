import * as React from 'react';
import { connect } from 'react-redux';
import { firebase } from '../firebase';


interface IProps {
  authUser?: any;
  onSetAuthUser?: any;
}

interface IState {
  authUser?: any;
  loading: boolean;
}

export const withAuthentication = (Component: any) => {
  class WithAuthentication extends React.Component<IProps, IState> {
    constructor(props: IProps) {
      super(props);

      const ls = localStorage.getItem('authUser') || '';
      this.props.onSetAuthUser(ls.length ? JSON.parse(ls) : null);
    }

    public componentDidMount() {
      const { onSetAuthUser }: any = this.props;
      firebase.auth.onAuthStateChanged(authUser => {
        if (authUser) {
          onSetAuthUser(authUser) 
          localStorage.setItem('authUser', JSON.stringify(authUser));
        } else {
          onSetAuthUser(null);
          localStorage.removeItem('authUser');
        }
      });
    }

    public render() {
      return <Component {...this.props} />;
    }  
  }

  const mapDispatchToProps = (dispatch: any): any => ({
    onSetAuthUser: (authUser: any) =>
      dispatch({ type: 'AUTH_USER_SET', authUser }),
  });

  return connect(null, mapDispatchToProps)(WithAuthentication);
};
