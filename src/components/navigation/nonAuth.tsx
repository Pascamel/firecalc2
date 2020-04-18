import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { Collapse, Nav, Navbar, NavbarToggler } from 'reactstrap';

import * as ROUTES from '../../constants/routes';
import NavBarItem from './item';

interface IProps {
  darkMode: boolean;
}

const NavigationNonAuth = ({ darkMode }: IProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggle = () => {
    setIsOpen(!isOpen);
  };

  const toggleIfOpen = () => {
    if (isOpen) {
      toggle();
    }
  };

  return (
    <Navbar light={!darkMode} dark={darkMode} expand="md">
      <NavLink className="navbar-brand" to={ROUTES.HOME}>
        FireCalc
      </NavLink>
      <NavbarToggler onClick={toggle} />
      <Collapse isOpen={isOpen} navbar>
        <Nav className="ml-auto" navbar>
          <NavBarItem
            to={ROUTES.SIGN_IN}
            onClick={toggleIfOpen}
            icon="sign-in-alt"
            label="Sign In"
          />
          <NavBarItem
            to={ROUTES.SIGN_UP}
            onClick={toggleIfOpen}
            icon="user-plus"
            label="Sign Up"
          />
        </Nav>
      </Collapse>
    </Navbar>
  );
};

export default NavigationNonAuth;
