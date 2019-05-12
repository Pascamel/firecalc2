import React from 'react';
import { connect } from 'react-redux';
import { compose } from 'recompose';
import {
  Container, Row, Col,
  Collapse,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  Nav,
  Navbar,
  NavbarBrand,
  NavbarToggler,
  NavItem,
  UncontrolledDropdown
} from 'reactstrap';
import { NavLink, Link, withRouter } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import _ from 'lodash';
import * as ROUTES from '../constants/routes';
import * as CHARTS from '../constants/charts';
import helpers from '../helpers';
import { SignOutLink } from './SignOutLink';


interface IProps {
  location: any,
  authUser: firebase.User|null
}

interface IState {
  isOpen: boolean,
  authUser: firebase.User|null
}

class NavigationAuth extends React.Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);

    this.toggle = this.toggle.bind(this);
    this.state = {
      isOpen: false,
      authUser: null //needs cleaning
    };
  }

  toggle () {
    this.setState({
      isOpen: !this.state.isOpen
    });
  }

  toggleIfOpen () {
    if (this.state.isOpen) this.toggle();
  }

  navLinkClass = (route: string) => {
    const classNames = ['nav-link']
    if (route.split('/')[1] === this.props.location.pathname.split('/')[1]) classNames.push('active');

    return classNames.join(' ');
  }

  render () {
    const { authUser } = this.props;
    const DEFAULT_CHART = ROUTES.CHARTS.replace(':type', CHARTS.URL.INCOME_VS_SAVINGS);

    return (
      <Navbar light expand="md">
        <NavbarBrand href={ROUTES.DASHBOARD}>FireCalc</NavbarBrand>
        <NavbarToggler onClick={this.toggle} />
        <Collapse isOpen={this.state.isOpen} navbar>
          <Nav navbar>
            <NavItem>
              <NavLink className={this.navLinkClass(ROUTES.MONTH)} to={helpers.currentMonthRoute()} onClick={()=>this.toggleIfOpen()}>
                <FontAwesomeIcon icon={['far', 'calendar-alt']} className="mr-1" />
                Month
              </NavLink>
            </NavItem>
            <NavItem>
              <NavLink className="nav-link" to={ROUTES.REVENUES} onClick={()=>this.toggleIfOpen()}>
                <FontAwesomeIcon icon="user-tie" className="mr-1" />
                Revenues
              </NavLink>
            </NavItem>
            <NavItem>
              <NavLink className="nav-link" to={ROUTES.SAVINGS} onClick={()=>this.toggleIfOpen()}>
                <FontAwesomeIcon icon="piggy-bank" className="mr-1" />
                Savings
              </NavLink>
            </NavItem>
            <NavItem>
              <NavLink className={this.navLinkClass(ROUTES.CHARTS)} to={DEFAULT_CHART} onClick={()=>this.toggleIfOpen()}>
                <FontAwesomeIcon icon="chart-area" className="mr-1" />
                Charts
              </NavLink>
            </NavItem>
            <NavItem>
              <NavLink className="nav-link" to={ROUTES.SETTINGS} onClick={()=>this.toggleIfOpen()}>
                <FontAwesomeIcon icon="cogs" className="mr-1" />
                Settings
              </NavLink>
            </NavItem>
            <NavItem>
              <NavLink className="nav-link" to={ROUTES.ADMIN} onClick={()=>this.toggleIfOpen()}>
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
                  <Link className="no-link" to={ROUTES.ACCOUNT} onClick={()=>this.toggleIfOpen()}>
                    Account
                  </Link>
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
}

class NavigationNonAuth extends React.Component<{}, IState> {
  constructor(props: IProps) {
    super(props);

    this.toggle = this.toggle.bind(this);
    this.state = {
      isOpen: false,
      authUser: null
    };
  }

  toggle () {
    this.setState({
      isOpen: !this.state.isOpen
    });
  }

  toggleIfOpen () {
    if (this.state.isOpen) this.toggle();
  }

  render () {
    return (
      <Navbar light expand="md">
        <NavbarBrand href={ROUTES.HOME}>FiReCalc</NavbarBrand>
        <NavbarToggler onClick={this.toggle} />
        <Collapse isOpen={this.state.isOpen} navbar>
          <Nav className="ml-auto" navbar>
            <NavItem>
              <NavLink className="nav-link" to={ROUTES.SIGN_IN} onClick={()=>this.toggleIfOpen()}>
                Sign In
              </NavLink>
            </NavItem>
            <NavItem>
              <NavLink className="nav-link" to={ROUTES.SIGN_UP} onClick={()=>this.toggleIfOpen()}>
                Sign Up
              </NavLink>
            </NavItem>
          </Nav>
        </Collapse>
      </Navbar>
    );
  }
}

class NavigationBase extends React.Component<any, IState> {
  render () {
    const { location, authUser } = this.props;
    
    return (
      <Container fluid className="nav-container">
        <Row>
          <Col>
            <Container>
              <Row>
                <Col>
                  {authUser ? <NavigationAuth location={location} authUser={authUser} /> : 
                  <NavigationNonAuth />}
                </Col>
              </Row>
            </Container>
          </Col>
        </Row>
      </Container> 
    );
  }
}

const mapStateToProps = (state: any) => {
  return ({
    authUser: state.sessionState.authUser,
  });
}

export const Navigation = compose(
  withRouter, 
  connect(mapStateToProps)
)(NavigationBase)
