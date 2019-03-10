import * as React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import * as ROUTES from '../constants/routes';
import { firebase } from '../firebase';
import { withAuthentication } from '../firebase/withAuthentication';
import { Account } from '../pages/Account';
import { HomePage } from '../pages/Home';
import { PasswordForget } from '../pages/PasswordForget';
import { SignIn } from '../pages/SignIn';
import { SignUp } from '../pages/SignUp';
import Navigation from './Navigation';

import AdminPage from '../pages/Admin';
import HeadersPage from '../pages/Headers';
import { RevenuesPage } from '../pages/Revenues';
import { SavingsPage } from '../pages/Savings';
import { MonthPage } from '../pages/Month';
import { StatsPage } from '../pages/Stats';

class AppComponent extends React.Component {
  constructor(props: any) {
    super(props);

    this.state = {
      authUser: null
    };
  }

  public componentDidMount() {
    firebase.auth.onAuthStateChanged(authUser => {
      authUser
        ? this.setState(() => ({ authUser }))
        : this.setState(() => ({ authUser: null }));
    });
  }

  public render() {
    return (
      <BrowserRouter>
        <div>
          <Navigation />
          <Switch>
            <Route exact={true} path={ROUTES.SIGN_UP} component={SignUp} />
            <Route exact={true} path={ROUTES.SIGN_IN} component={SignIn} />
            <Route exact={true} path={ROUTES.PASSWORD_FORGET} component={PasswordForget} />
            <Route exact={true} path={ROUTES.HOME} component={HomePage} />
            <Route exact={true} path={ROUTES.ACCOUNT} component={Account} />
            <Route path={ROUTES.ADMIN} component={AdminPage} />
            <Route path={ROUTES.HEADERS} component={HeadersPage} />
            <Route path={ROUTES.REVENUES} component={RevenuesPage} />
            <Route path={ROUTES.SAVINGS} component={SavingsPage} />
            <Route path={ROUTES.MONTH} component={MonthPage} />
            <Route path={ROUTES.STATS} component={StatsPage} />
          </Switch>
        </div>
      </BrowserRouter>
    );
  }
}

export const App = withAuthentication(AppComponent);
