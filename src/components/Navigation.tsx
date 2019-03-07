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
  NavLink,
  UncontrolledDropdown
} from 'reactstrap';
import * as ROUTES from '../constants/routes';
import { AuthUserContext } from '../firebase/AuthUserContext';
import { SignOutLink } from './SignOutLink';
import { auth } from '../firebase';


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
    const {authUser} = this.props,
      currentYear = (new Date().getFullYear()).toString(),
      currentMonth = (new Date().getMonth() + 1).toString(),
      route = ROUTES.MONTH.replace(':year', currentYear).replace(':month', currentMonth);

    return (
      <Container>
        <Row>
          <Col>
            <Navbar light expand="md">
              <NavbarBrand href={ROUTES.DASHBOARD}>FiReCalc</NavbarBrand>
              <NavbarToggler onClick={this.toggle} />
              <Collapse isOpen={this.state.isOpen} navbar>
                <Nav navbar>
                  <NavItem>
                    <NavLink href={route}>Month</NavLink>
                  </NavItem>
                  <NavItem>
                    <NavLink href={ROUTES.REVENUES} active={window.location.pathname === ROUTES.REVENUES}>
                      Revenues
                    </NavLink>
                  </NavItem>
                  <NavItem>
                    <NavLink href={ROUTES.SAVINGS} active={window.location.pathname === ROUTES.SAVINGS}>
                      Savings
                    </NavLink>
                  </NavItem>
                  <NavItem>
                    <NavLink href={ROUTES.HEADERS} active={window.location.pathname === ROUTES.HEADERS}>
                      Settings
                    </NavLink>
                  </NavItem>
                  <NavItem>
                    <NavLink href={ROUTES.ADMIN}>Admin</NavLink>
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
                    <NavLink href={ROUTES.SIGN_IN}>Sign In</NavLink>
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