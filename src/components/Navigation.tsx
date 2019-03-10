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
import { NavLink } from 'react-router-dom'
import _ from 'lodash';
import * as ROUTES from '../constants/routes';
import * as CHARTS from '../constants/charts';
import { AuthUserContext } from '../firebase/AuthUserContext';
import { SignOutLink } from './SignOutLink';


interface IProps {
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

  render () {
    const {authUser} = this.props;
    const CURRENT_MONTH = ROUTES.MONTH
      .replace(':year', (new Date().getFullYear()).toString())
      .replace(':month', (new Date().getMonth() + 1).toString());
    const DEFAULT_CHART = ROUTES.STATS.replace(':type', CHARTS.URL.INCOME_VS_SAVINGS);

    return (
      <Container>
        <Row>
          <Col>
            <Navbar light expand="md">
              <NavbarBrand href={ROUTES.DASHBOARD}>FireCalc</NavbarBrand>
              <NavbarToggler onClick={this.toggle} />
              <Collapse isOpen={this.state.isOpen} navbar>
                <Nav navbar>
                  <NavItem>
                    <NavLink className="nav-link" to={CURRENT_MONTH}>
                      Month
                    </NavLink>
                  </NavItem>
                  <NavItem>
                    <NavLink className="nav-link" to={ROUTES.REVENUES}>
                      Revenues
                    </NavLink>
                  </NavItem>
                  <NavItem>
                    <NavLink className="nav-link" to={ROUTES.SAVINGS}>
                      Savings
                    </NavLink>
                  </NavItem>
                  <NavItem>
                    <NavLink className="nav-link" to={DEFAULT_CHART}>
                      Stats
                    </NavLink>
                  </NavItem>
                  <NavItem>
                    <NavLink className="nav-link" to={ROUTES.HEADERS}>
                      Settings
                    </NavLink>
                  </NavItem>
                  <NavItem>
                    <NavLink className="nav-link" to={ROUTES.ADMIN}>Admin</NavLink>
                  </NavItem>
                </Nav> 
                <Nav className="ml-auto" navbar>
                  <UncontrolledDropdown nav inNavbar>
                    <DropdownToggle nav caret>{authUser ? authUser.email : 'User'}</DropdownToggle>
                    <DropdownMenu right>
                      <DropdownItem tag="a" href={ROUTES.ACCOUNT} >Account</DropdownItem>
                      <DropdownItem divider />
                      <DropdownItem tag="a" href="">
                        <SignOutLink />
                      </DropdownItem>
                    </DropdownMenu> 
                  </UncontrolledDropdown> 
                </Nav>
              </Collapse>
            </Navbar>
          </Col>
        </Row>
      </Container>
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
      <Container>
        <Row>
          <Col>
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
                </Nav>
              </Collapse>
            </Navbar>
          </Col>
        </Row>
      </Container>
    );
  }
}

export default class Navigation extends React.Component {
  render () {
    return (
      <div>
       <AuthUserContext.Consumer>
         {(authUser) => authUser ? <NavigationAuth authUser={authUser} /> : <NavigationNonAuth />}
       </AuthUserContext.Consumer>
     </div>
    );
  }
}