import './icons';

import { LocationState } from 'history';
import React from 'react';
import { connect } from 'react-redux';
import { BrowserRouter, Redirect, Route, Switch } from 'react-router-dom';

import * as ROUTES from '../constants/routes';
import { withAuthentication } from '../firebase/withAuthentication';
import { currentMonthRoute } from '../helpers';
import { AccountPage } from '../pages/Account';
import { AdminPage } from '../pages/Admin';
import { ChartsPage } from '../pages/Charts';
import { NotAuthorizedPage, NotFoundPage } from '../pages/Error';
import { HomePage } from '../pages/Home';
import { MonthPage } from '../pages/Month';
import PasswordForgetPage from '../pages/PasswordForget';
import { RevenuesPage } from '../pages/Revenues';
import { SavingsPage } from '../pages/Savings';
import { SettingsPage } from '../pages/Settings';
import { SignIn } from '../pages/SignIn';
import { SignUp } from '../pages/SignUp';
import { AppState } from '../store';
import { Navigation } from './';

interface IProps {
  location?: LocationState;
  darkMode: boolean;
}

const AppComponent = (props: IProps) => {
  if (props.darkMode) {
    document.body.classList.add('dark-mode');
  } else {
    document.body.classList.remove('dark-mode');
  }

  return (
    <BrowserRouter>
      <>
        <Navigation />
        <Switch>
          <Route exact path={ROUTES.SIGN_UP} component={SignUp} />
          <Route exact path={ROUTES.SIGN_IN} component={SignIn} />
          <Route
            exact
            path={ROUTES.PASSWORD_FORGET}
            component={PasswordForgetPage}
          />
          <Route exact path={ROUTES.HOME} component={HomePage} />
          <Route exact path={ROUTES.ACCOUNT} component={AccountPage} />
          <Route path={ROUTES.MONTH} component={MonthPage} />
          <Route
            exact
            path={ROUTES.MONTH_NO_PARAMS}
            render={() => <Redirect to={currentMonthRoute()} />}
          />
          <Route exact path={ROUTES.REVENUES} component={RevenuesPage} />
          <Route exact path={ROUTES.SAVINGS} component={SavingsPage} />
          <Route path={ROUTES.CHARTS_YEARS_AMOUNT} component={ChartsPage} />
          <Route path={ROUTES.CHARTS_YEAR} component={ChartsPage} />
          <Route path={ROUTES.CHARTS} component={ChartsPage} />
          <Route exact path={ROUTES.SETTINGS} component={SettingsPage} />
          <Route path={ROUTES.ADMIN} component={AdminPage} />
          <Route
            exact
            path={ROUTES.NOT_AUTHORIZED}
            component={NotAuthorizedPage}
          />
          <Route path="*" component={NotFoundPage} />
        </Switch>
      </>
    </BrowserRouter>
  );
};

const mapStateToProps = (state: AppState) => {
  return {
    darkMode: state.sessionState.darkMode
  };
};

const App = connect(mapStateToProps)(withAuthentication(AppComponent));

export default App;
