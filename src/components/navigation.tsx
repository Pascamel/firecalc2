import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { LocationState } from 'history';
import React, { useState } from 'react';
import { connect } from 'react-redux';
import { Link, NavLink, withRouter } from 'react-router-dom';
import {
  Col,
  Collapse,
  Container,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  Nav,
  NavItem,
  Navbar,
  NavbarToggler,
  Row,
  UncontrolledDropdown
} from 'reactstrap';
import { compose } from 'recompose';

import * as CHARTS from '../constants/charts';
import * as ROUTES from '../constants/routes';
import helpers from '../helpers';
import { AppState } from '../store';
import { DarkSwitcher, SignOutLink } from '.';

interface IProps {
  location?: LocationState;
  authUser?: firebase.User | null;
}

const NavigationAuth = (props: IProps) => {
  const { location, authUser } = props;
  const [isOpen, setIsOpen] = useState(false);
  const DEFAULT_CHART = ROUTES.CHARTS.replace(':type', CHARTS.URL.INCOME_VS_SAVINGS);
  
  const toggle = () => {
    setIsOpen(!isOpen);
  }

  const toggleIfOpen = () => {
    if (isOpen) toggle();
  }

  const navLinkClass = (route: string) => {
    const classNames = ['nav-link']
    if (route.split('/')[1] === location.pathname.split('/')[1]) classNames.push('active');

    return classNames.join(' ');
  }  

  return (
    <Navbar light expand="md">
      <NavLink className="navbar-brand" to={ROUTES.HOME}>
        FireCalc
      </NavLink>
      <NavbarToggler onClick={toggle} />
      <Collapse isOpen={isOpen} navbar>
        <Nav navbar className="main-nav-bar">
          <NavItem>
            <NavLink className={navLinkClass(ROUTES.MONTH)} to={helpers.currentMonthRoute()} onClick={toggleIfOpen}>
              <FontAwesomeIcon icon={['far', 'calendar-alt']} className="mr-1" />
              Month
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink className="nav-link" to={ROUTES.REVENUES} onClick={toggleIfOpen}>
              <FontAwesomeIcon icon="user-tie" className="mr-1" />
              Revenues
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink className="nav-link" to={ROUTES.SAVINGS} onClick={toggleIfOpen}>
              <FontAwesomeIcon icon="piggy-bank" className="mr-1" />
              Savings
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink className={navLinkClass(ROUTES.CHARTS)} to={DEFAULT_CHART} onClick={toggleIfOpen}>
              <FontAwesomeIcon icon="chart-area" className="mr-1" />
              Charts
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink className="nav-link" to={ROUTES.SETTINGS} onClick={toggleIfOpen}>
              <FontAwesomeIcon icon="cogs" className="mr-1" />
              Settings
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink className="nav-link" to={ROUTES.ADMIN} onClick={toggleIfOpen}>
              <FontAwesomeIcon icon="solar-panel" className="mr-1" />
              Admin
            </NavLink>
          </NavItem>
        </Nav> 
        <Nav className="ml-auto" navbar>
          <UncontrolledDropdown nav inNavbar>
            <DropdownToggle nav caret>{authUser ? authUser.email : 'User'}</DropdownToggle>
            <DropdownMenu right>
              <DropdownItem >
                <Link className="no-link" to={ROUTES.ACCOUNT} onClick={toggleIfOpen}>
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
}

const NavigationNonAuth = (props: IProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggle = () => {
    setIsOpen(!isOpen);
  }

  const toggleIfOpen = () => {
    if (isOpen) toggle();
  }

  return (
    <Navbar light expand="md">
      <NavLink className="navbar-brand" to={ROUTES.HOME}>
        FireCalc
      </NavLink>
      <NavbarToggler onClick={toggle} />
      <Collapse isOpen={isOpen} navbar>
        <Nav className="ml-auto" navbar>
          <NavItem>
            <NavLink className="nav-link" to={ROUTES.SIGN_IN} onClick={toggleIfOpen}>
              Sign In
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink className="nav-link" to={ROUTES.SIGN_UP} onClick={toggleIfOpen}>
              Sign Up
            </NavLink>
          </NavItem>
        </Nav>
      </Collapse>
    </Navbar>
  );
}

const NavigationBase = (props: any) => {
  const { location, authUser } = props;
    
  return (
    <Container fluid className="nav-container">
      <Row>
        <Col>
          <Container>
            <Row>
              <Col>
                {authUser ? <NavigationAuth location={location} authUser={authUser} /> : <NavigationNonAuth location={location} authUser={authUser} />}
              </Col>
            </Row>
          </Container>
        </Col>
      </Row>
    </Container> 
  );
}

const mapStateToProps = (state: AppState) => {
  return ({
    authUser: state.sessionState.authUser,
  });
}

export default compose(
  withRouter, 
  connect(mapStateToProps)
)(NavigationBase);
