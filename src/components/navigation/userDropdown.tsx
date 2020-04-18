import React from 'react';
import { Link } from 'react-router-dom';
import { DropdownItem, DropdownMenu, DropdownToggle, UncontrolledDropdown } from 'reactstrap';

import { DarkSwitcher, Mobile, NotMobile, SignOutLink } from '../';
import * as ROUTES from '../../constants/routes';
import NavBarItem from './item';

interface IProps {
  authUser?: firebase.User | null;
  onClick?: (event: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => void;
}

const UserDropdown = ({ authUser, onClick }: IProps) => {
  return (
    <>
      <NotMobile>
        <UncontrolledDropdown nav inNavbar>
          <DropdownToggle nav caret>
            {authUser ? authUser.email : 'User'}
          </DropdownToggle>
          <DropdownMenu right>
            <DropdownItem>
              <Link className="no-link" to={ROUTES.ACCOUNT} onClick={onClick}>
                <i className="fa fa-lg fa-fw fa-user" />
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
      </NotMobile>
      <Mobile>
        <NavBarItem
          to={ROUTES.ACCOUNT}
          icon={['far', 'user']}
          label={authUser && authUser.email ? authUser.email : 'User'}
          onClick={onClick}
        />
        <div className="nav-link">
          <DarkSwitcher />
        </div>
        <div className="nav-link">
          <SignOutLink />
        </div>
      </Mobile>
    </>
  );
};

export default UserDropdown;
