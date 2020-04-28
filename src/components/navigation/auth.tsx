import { LocationState } from 'history';
import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { Collapse, Nav, Navbar, NavbarToggler } from 'reactstrap';

import { DarkSwitcher, SignOutLink } from '../';
import CHARTS from '../../constants/charts';
import ROUTES from '../../constants/routes';
import { currentMonthRoute } from '../../helpers';
import NavBarItem from './item';
import UserDropdown from './userDropdown';

interface IProps {
  location?: LocationState;
  authUser?: firebase.User | null;
  darkMode: boolean;
}

const NavigationAuth = ({ location, authUser, darkMode }: IProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const DEFAULT_CHART = ROUTES.CHARTS.replace(
    ':type',
    CHARTS.INCOME_VS_SAVINGS.URL
  );

  const toggle = () => {
    setIsOpen(!isOpen);
  };

  const toggleIfOpen = () => {
    if (isOpen) toggle();
  };

  const isSubRouteOf = (route: string) => {
    return route.split('/')[1] === location.pathname.split('/')[1];
  };

  return (
    <Navbar light={!darkMode} dark={darkMode} expand="md">
      <NavLink className="navbar-brand" to={ROUTES.HOME}>
        FireCalc
      </NavLink>
      <NavbarToggler onClick={toggle} />
      <Collapse isOpen={isOpen} navbar>
        <Nav navbar className="main-nav-bar">
          <NavBarItem
            active={isSubRouteOf(ROUTES.MONTH)}
            to={currentMonthRoute()}
            icon={['far', 'calendar-alt']}
            label="Month"
            onClick={toggleIfOpen}
          />
          <NavBarItem
            to={ROUTES.REVENUES}
            icon="user-tie"
            label="Revenues"
            onClick={toggleIfOpen}
          />
          <NavBarItem
            to={ROUTES.SAVINGS}
            icon="piggy-bank"
            label="Savings"
            onClick={toggleIfOpen}
          />
          <NavBarItem
            active={isSubRouteOf(ROUTES.CHARTS)}
            to={DEFAULT_CHART}
            icon="chart-area"
            label="Charts"
            onClick={toggleIfOpen}
          />
          <NavBarItem
            to={ROUTES.SETTINGS}
            icon="cogs"
            label="Settings"
            onClick={toggleIfOpen}
          />
          <NavBarItem
            to={ROUTES.ADMIN}
            icon="solar-panel"
            label="Admin"
            onClick={toggleIfOpen}
          />
          <NavBarItem
            className="d-inline-block d-sm-none"
            to={ROUTES.ACCOUNT}
            icon={['far', 'user']}
            label={authUser && authUser.email ? authUser.email : 'User'}
            onClick={toggleIfOpen}
          />
          <div className="nav-link d-inline-block d-sm-none">
            <DarkSwitcher />
          </div>
          <div className="nav-link d-inline-block d-sm-none">
            <SignOutLink />
          </div>
        </Nav>
        <Nav navbar className="main-nav-bar ml-auto d-none d-sm-inline-block">
          <UserDropdown authUser={authUser} />
        </Nav>
      </Collapse>
    </Navbar>
  );
};

export default NavigationAuth;
