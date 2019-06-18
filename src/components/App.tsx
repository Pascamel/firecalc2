import { LocationState } from 'history';
import * as React from 'react';
import { BrowserRouter, Route, Switch, Redirect } from 'react-router-dom';

import * as ROUTES from '../constants/routes';
import { firebase } from '../firebase';
import { withAuthentication } from '../firebase/withAuthentication';
import helpers from '../helpers';
import { AccountPage } from '../pages/Account';
import { HomePage } from '../pages/Home';
import PasswordForgetPage from '../pages/PasswordForget';
import { SignIn } from '../pages/SignIn';
import { SignUp } from '../pages/SignUp';
import { Navigation } from './Navigation';
import { AdminPage } from '../pages/Admin';
import { DashboardPage } from '../pages/Dashboard';
import { MonthPage } from '../pages/Month';
import { RevenuesPage } from '../pages/Revenues';
import { SavingsPage } from '../pages/Savings';
import { SettingsPage } from '../pages/Settings';
import { ChartsPage } from '../pages/Charts';
import { NotFoundPage } from '../pages/NotFound';
import './icons';

interface IProps {
  location?: LocationState;
}

class AppComponent extends React.Component<IProps, {}> {
  constructor(props: IProps) {
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
        <React.Fragment>
          <Navigation />
          <Switch>
            <Route exact path={ROUTES.SIGN_UP} component={SignUp} />
            <Route exact path={ROUTES.SIGN_IN} component={SignIn} />
            <Route exact path={ROUTES.PASSWORD_FORGET} component={PasswordForgetPage} />
            <Route exact path={ROUTES.HOME} component={HomePage} />
            <Route exact path={ROUTES.ACCOUNT} component={AccountPage} />
            <Route exact path={ROUTES.DASHBOARD} component={DashboardPage} />
            <Route path={ROUTES.MONTH} component={MonthPage} />
            <Route exact path={ROUTES.MONTH_NO_PARAMS} render={() => (<Redirect to={helpers.currentMonthRoute()} />)} />
            <Route exact path={ROUTES.REVENUES} component={RevenuesPage} />
            <Route exact path={ROUTES.SAVINGS} component={SavingsPage} />
            <Route path={ROUTES.CHARTS} component={ChartsPage} />
            <Route exact path={ROUTES.SETTINGS} component={SettingsPage} />
            <Route path={ROUTES.ADMIN} component={AdminPage} />
            <Route path='*' component={NotFoundPage}/>
          </Switch>
        </React.Fragment>
      </BrowserRouter>
    );
  }
}

export const App = withAuthentication(AppComponent);
