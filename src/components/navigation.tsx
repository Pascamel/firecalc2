import { LocationState } from 'history';
import React, { useState } from 'react';
import { connect } from 'react-redux';
import { Link, NavLink, withRouter } from 'react-router-dom';
import {
    Col, Collapse, Container, DropdownItem, DropdownMenu, DropdownToggle, Nav, Navbar,
    NavbarToggler, NavItem, Row, UncontrolledDropdown
} from 'reactstrap';
import { compose } from 'recompose';

import { Icon } from '../components';
import * as CHARTS from '../constants/charts';
import * as ROUTES from '../constants/routes';
import helpers from '../helpers';
import { AppState } from '../store';
import { DarkSwitcher, SignOutLink } from './';

interface IProps {
  location?: LocationState;
  authUser?: firebase.User | null;
  darkMode: boolean;
  updated: boolean;
}

const NavigationAuth = (props: IProps) => {
  const { location, authUser, darkMode, updated } = props;
  const [isOpen, setIsOpen] = useState(false);
  const DEFAULT_CHART = ROUTES.CHARTS.replace(
    ':type',
    CHARTS.URL.INCOME_VS_SAVINGS
  );

  const toggle = () => {
    setIsOpen(!isOpen);
  };

  const toggleIfOpen = () => {
    if (isOpen) toggle();
  };

  const navLinkClass = (route: string) => {
    const classNames = ['nav-link'];
    if (route.split('/')[1] === location.pathname.split('/')[1])
      classNames.push('active');

    return classNames.join(' ');
  };

  return (
    <Navbar light={!darkMode} dark={darkMode} expand="md">
      <NavLink className="navbar-brand" to={ROUTES.HOME}>
        FireCalc
      </NavLink>
      <NavbarToggler onClick={toggle} />
      <Collapse isOpen={isOpen} navbar>
        <Nav navbar className="main-nav-bar">
          <NavItem>
            <NavLink
              className={`${navLinkClass(ROUTES.MONTH)} ${
                updated ? 'updated' : ''
              }`}
              to={helpers.currentMonthRoute()}
              onClick={toggleIfOpen}
            >
              <Icon icon={['far', 'calendar-alt']} className="mr-1" />
              Month
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink
              className={`nav-link ${updated ? 'updated' : ''}`}
              to={ROUTES.REVENUES}
              onClick={toggleIfOpen}
            >
              <Icon icon="user-tie" className="mr-1" />
              Revenues
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink
              className={`nav-link ${updated ? 'updated' : ''}`}
              to={ROUTES.SAVINGS}
              onClick={toggleIfOpen}
            >
              <Icon icon="piggy-bank" className="mr-1" />
              Savings
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink
              className={`${navLinkClass(ROUTES.CHARTS)} ${
                updated ? 'updated' : ''
              }`}
              to={DEFAULT_CHART}
              onClick={toggleIfOpen}
            >
              <Icon icon="chart-area" className="mr-1" />
              Charts
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink
              className={`nav-link ${updated ? 'updated' : ''}`}
              to={ROUTES.SETTINGS}
              onClick={toggleIfOpen}
            >
              <Icon icon="cogs" className="mr-1" />
              Settings
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink
              className={`nav-link ${updated ? 'updated' : ''}`}
              to={ROUTES.ADMIN}
              onClick={toggleIfOpen}
            >
              <Icon icon="solar-panel" className="mr-1" />
              Admin
            </NavLink>
          </NavItem>
        </Nav>
        <Nav className="ml-auto" navbar>
          <UncontrolledDropdown nav inNavbar>
            <DropdownToggle nav caret>
              {authUser ? authUser.email : 'User'}
            </DropdownToggle>
            <DropdownMenu right>
              <DropdownItem>
                <Link
                  className="no-link"
                  to={ROUTES.ACCOUNT}
                  onClick={toggleIfOpen}
                >
                  <i className="fa fa-lg fa-user pr-2" />
                  Account
                </Link>
              </DropdownItem>
              <DropdownItem>
                <DarkSwitcher />
              </DropdownItem>
              <DropdownItem divider />
              <DropdownItem>
                <SignOutLink />
              </DropdownItem>
            </DropdownMenu>
          </UncontrolledDropdown>
        </Nav>
      </Collapse>
    </Navbar>
  );
};

const NavigationNonAuth = (props: IProps) => {
  const { darkMode } = props;

  const [isOpen, setIsOpen] = useState(false);

  const toggle = () => {
    setIsOpen(!isOpen);
  };

  const toggleIfOpen = () => {
    if (isOpen) toggle();
  };

  return (
    <Navbar light={!darkMode} dark={darkMode} expand="md">
      <NavLink className="navbar-brand" to={ROUTES.HOME}>
        FireCalc
      </NavLink>
      <NavbarToggler onClick={toggle} />
      <Collapse isOpen={isOpen} navbar>
        <Nav className="ml-auto" navbar>
          <NavItem>
            <NavLink
              className="nav-link"
              to={ROUTES.SIGN_IN}
              onClick={toggleIfOpen}
            >
              Sign In
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink
              className="nav-link"
              to={ROUTES.SIGN_UP}
              onClick={toggleIfOpen}
            >
              Sign Up
            </NavLink>
          </NavItem>
        </Nav>
      </Collapse>
    </Navbar>
  );
};

const NavigationBase = (props: any) => {
  const { authUser } = props;

  return (
    <Container fluid className="nav-container">
      <Row>
        <Col>
          <Container>
            <Row>
              <Col>
                {authUser ? (
                  <NavigationAuth {...props} />
                ) : (
                  <NavigationNonAuth {...props} />
                )}
              </Col>
            </Row>
          </Container>
        </Col>
      </Row>
    </Container>
  );
};

const mapStateToProps = (state: AppState) => {
  return {
    authUser: state.sessionState.authUser,
    darkMode: state.sessionState.darkMode,
    updated:
      state.bankState.bankSavingsUpdated ||
      state.bankState.bankIncomeUpdated ||
      state.bankState.bankOthersUpdated ||
      state.bankState.bankHeadersUpdated
  };
};

export default compose(withRouter, connect(mapStateToProps))(NavigationBase);
