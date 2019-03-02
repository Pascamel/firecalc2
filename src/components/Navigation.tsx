import React, { Component } from 'react';
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
// import { Link } from "react-router-dom";
import * as ROUTES from "../constants/routes";
import { AuthUserContext } from "../firebase/AuthUserContext";
import { SignOutLink } from "./SignOutLink";
import { auth } from '../firebase';



// const NavigationAuth = () => (
//   <ul>
//     <li>
//       <Link to={routes.LANDING}>Landing</Link>
//     </li>
//     <li>
//       <Link to={routes.HOME}>Home</Link>
//     </li>
//     <li>
//       <Link to={routes.ACCOUNT}>Account</Link>
//     </li>
//     <li>
//       <SignOutButton />
//     </li>
//   </ul>
// );

// const NavigationNonAuth = () => (
//   <ul>
//     <li>
//       <Link to={routes.LANDING}>Landing</Link>
//     </li>
//     <li>
//       <Link to={routes.SIGN_IN}>Sign In</Link>
//     </li>
//   </ul>
// );

// export const Navigation = () => (
//   <AuthUserContext.Consumer>
//     {authUser => (authUser ? <NavigationAuth /> : <NavigationNonAuth />)}
//   </AuthUserContext.Consumer>
// );

interface INavigationAuthProps {
  authUser: firebase.User|null
}

interface INavigationAuthState {
  isOpen: boolean
}

class NavigationAuth extends Component<INavigationAuthProps, INavigationAuthState> {
  constructor(props: INavigationAuthProps) {
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
                    <NavLink href={ROUTES.REVENUES}>Revenues</NavLink>
                  </NavItem>
                  <NavItem>
                    <NavLink href={ROUTES.SAVINGS}>Savings</NavLink>
                  </NavItem>
                  <NavItem>
                    <NavLink href={ROUTES.HEADERS}>Settings</NavLink>
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
                      <DropdownItem tag="span" onClick={auth.doSignOut}>
                        Test
                      </DropdownItem>
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

interface INavigationNonAuthProps {
  // isOpen: boolean
}

interface INavigationNonAuthState {
  isOpen: boolean
}

class NavigationNonAuth extends Component<INavigationNonAuthProps, INavigationNonAuthState> {
  constructor(props: INavigationNonAuthProps) {
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

export default class Navigation extends Component {
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