import * as React from 'react';
import { firebase } from '../firebase';
import { AuthUserContext } from './AuthUserContext';


interface IProps {
  authUser?: any;
}

interface IState {
  authUser?: any;
  loading: boolean;
}

export const withAuthentication = (Component: any) => {
  class WithAuthentication extends React.Component<IProps, IState> {
    constructor(props: IProps) {
      super(props);

      this.state = {
        loading: true,
        authUser: null
      };
    }

    public componentDidMount() {
      firebase.auth.onAuthStateChanged(authUser => {
        authUser ? this.setState(() => ({ authUser })) : this.setState(() => ({ authUser: null }));
        this.setState({loading: false});
      });
    }

    public render() {
      const { authUser, loading } = this.state;
      
      if (loading) return null;

      return (
        <AuthUserContext.Provider value={authUser}>
          <Component />
        </AuthUserContext.Provider>
      );
    }
  }
  return WithAuthentication;
};
