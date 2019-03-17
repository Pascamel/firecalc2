import * as React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import * as ROUTES from '../constants/routes';
import { firebase } from '../firebase';
import { withAuthentication } from '../firebase/withAuthentication';
import { AccountPage } from '../pages/Account';
import { HomePage } from '../pages/Home';
import PasswordForgetPage from '../pages/PasswordForget';
import { SignIn } from '../pages/SignIn';
import { SignUp } from '../pages/SignUp';
import Navigation from './Navigation';
import { AdminPage } from '../pages/Admin';
import { DashboardPage } from '../pages/Dashboard';
import { MonthPage } from '../pages/Month';
import { RevenuesPage } from '../pages/Revenues';
import { SavingsPage } from '../pages/Savings';
import { SettingsPage } from '../pages/Settings';
import { StatsPage } from '../pages/Stats';
import './icons';


interface IProps {
  location?: any;
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
            <Route exact={true} path={ROUTES.SIGN_UP} component={SignUp} />
            <Route exact={true} path={ROUTES.SIGN_IN} component={SignIn} />
            <Route exact={true} path={ROUTES.PASSWORD_FORGET} component={PasswordForgetPage} />
            <Route exact={true} path={ROUTES.HOME} component={HomePage} />
            <Route exact={true} path={ROUTES.ACCOUNT} component={AccountPage} />
            <Route exact={true} path={ROUTES.DASHBOARD} component={DashboardPage} />
            <Route path={ROUTES.MONTH} component={MonthPage} />
            <Route exact={true} path={ROUTES.REVENUES} component={RevenuesPage} />
            <Route exact={true} path={ROUTES.SAVINGS} component={SavingsPage} />
            <Route path={ROUTES.STATS} component={StatsPage} />
            <Route exact={true} path={ROUTES.SETTINGS} component={SettingsPage} />
            <Route path={ROUTES.ADMIN} component={AdminPage} />
          </Switch>
        </React.Fragment>
      </BrowserRouter>
    );
  }
}

export const App = withAuthentication(AppComponent);
