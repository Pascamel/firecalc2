import './icons';

import { LocationState } from 'history';
import React, { useEffect, useState } from 'react';
import { BrowserRouter, Redirect, Route, Switch } from 'react-router-dom';

import * as ROUTES from '../constants/routes';
import { withAuthentication } from '../firebase/withAuthentication';
import helpers from '../helpers';
import { AccountPage } from '../pages/Account';
import { AdminPage } from '../pages/Admin';
import { ChartsPage } from '../pages/Charts';
import { DashboardPage } from '../pages/Dashboard';
import { HomePage } from '../pages/Home';
import { MonthPage } from '../pages/Month';
import { NotFoundPage } from '../pages/NotFound';
import PasswordForgetPage from '../pages/PasswordForget';
import { RevenuesPage } from '../pages/Revenues';
import { SavingsPage } from '../pages/Savings';
import { SettingsPage } from '../pages/Settings';
import { SignIn } from '../pages/SignIn';
import { SignUp } from '../pages/SignUp';
import { Navigation } from '.';

interface IProps {
  location?: LocationState;
}

const AppComponent = (props: IProps) => (
  <BrowserRouter>
    <>
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
    </>
  </BrowserRouter>
);

const App = withAuthentication(AppComponent);

export default App;
