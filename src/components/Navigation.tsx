import React from 'react';
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
import { AuthUserContext } from '../firebase/AuthUserContext';
import { SignOutLink } from './SignOutLink';


interface IProps {
  location: any,
  authUser: firebase.User|null
}

interface IState {
  isOpen: boolean
}

class NavigationAuth extends React.Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);

    this.toggle = this.toggle.bind(this);
    this.state = {
      isOpen: false
    };
  }

  toggle() {
    this.setState({
      isOpen: !this.state.isOpen
    });
  }

  navLinkClass = (route: string) => {
    const classNames = ['nav-link']
    if (route.split('/')[1] === this.props.location.pathname.split('/')[1]) classNames.push('active');

    return classNames.join(' ');
  }

  render () {
    const {authUser} = this.props;
    const DEFAULT_CHART = ROUTES.CHARTS.replace(':type', CHARTS.URL.INCOME_VS_SAVINGS);

    return (
      <Navbar light expand="md">
        <NavbarBrand href={ROUTES.DASHBOARD}>FireCalc</NavbarBrand>
        <NavbarToggler onClick={this.toggle} />
        <Collapse isOpen={this.state.isOpen} navbar>
          <Nav navbar>
            <NavItem>
              <NavLink className={this.navLinkClass(ROUTES.MONTH)} to={helpers.currentMonthRoute()}>
                <FontAwesomeIcon icon={['far', 'calendar-alt']} className="mr-1" />
                Month
              </NavLink>
            </NavItem>
            <NavItem>
              <NavLink className="nav-link" to={ROUTES.REVENUES}>
                <FontAwesomeIcon icon="user-tie" className="mr-1" />
                Revenues
              </NavLink>
            </NavItem>
            <NavItem>
              <NavLink className="nav-link" to={ROUTES.SAVINGS}>
                <FontAwesomeIcon icon="piggy-bank" className="mr-1" />
                Savings
              </NavLink>
            </NavItem>
            <NavItem>
              <NavLink className={this.navLinkClass(ROUTES.CHARTS)} to={DEFAULT_CHART}>
                <FontAwesomeIcon icon="chart-area" className="mr-1" />
                Charts
              </NavLink>
            </NavItem>
            <NavItem>
              <NavLink className="nav-link" to={ROUTES.SETTINGS}>
                <FontAwesomeIcon icon="cogs" className="mr-1" />
                Settings
              </NavLink>
            </NavItem>
            <NavItem>
              <NavLink className="nav-link" to={ROUTES.ADMIN}>
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
                  <Link className="no-link" to={ROUTES.ACCOUNT}>
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
      isOpen: false
    };
  }

  toggle() {
    this.setState({
      isOpen: !this.state.isOpen
    });
  }

  render () {
    return (
      <Navbar light expand="md">
        <NavbarBrand href={ROUTES.HOME}>FiReCalc</NavbarBrand>
        <NavbarToggler onClick={this.toggle} />
        <Collapse isOpen={this.state.isOpen} navbar>
          <Nav className="ml-auto" navbar>
            <NavItem>
              <NavLink className="nav-link" to={ROUTES.SIGN_IN}>
                Sign In
              </NavLink>
            </NavItem>
            <NavItem>
              <NavLink className="nav-link" to={ROUTES.SIGN_UP}>
                Sign Up
              </NavLink>
            </NavItem>
          </Nav>
        </Collapse>
      </Navbar>
    );
  }
}

class NavigationBase extends React.Component<any, {}> {
  render () {
    const { location } = this.props;
    
    return (
      <Container fluid className="nav-container">
        <Row>
          <Col>
            <Container>
              <Row>
                <Col>
                  <AuthUserContext.Consumer>
                    {(authUser) => authUser ? <NavigationAuth authUser={authUser} location={location} /> : <NavigationNonAuth />}
                  </AuthUserContext.Consumer>
                </Col>
              </Row>
            </Container>
          </Col>
        </Row>
      </Container> 
    );
  }
}

export const Navigation = withRouter(NavigationBase);
