import { History } from 'history';
import React from 'react';
import { connect } from 'react-redux';
import { NavLink } from 'react-router-dom';
import { NavItem } from 'reactstrap';

import { IconProp } from '@fortawesome/fontawesome-svg-core';

import { Icon } from '../../components';
import { joinFilter } from '../../helpers';
import { AppState } from '../../store';

interface IProps {
  active?: boolean;
  className?: string;
  icon: IconProp;
  iconClassName?: string;
  label: string;
  onClick?: (event: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => void;
  updated: boolean;
  to: History.LocationDescriptor<any>;
}

const NavBarItem = ({
  active,
  className,
  icon,
  iconClassName,
  label,
  onClick,
  to,
  updated,
}: IProps) => (
  <NavItem>
    <NavLink
      className={joinFilter(
        'nav-link',
        className,
        active ? 'active' : null,
        updated ? 'updated' : null
      )}
      to={to}
      onClick={onClick}
    >
      <Icon icon={icon} className={joinFilter(iconClassName, 'mr-1 fa-fw')} />
      {label}
    </NavLink>
  </NavItem>
);

const mapStateToProps = (state: AppState) => {
  return {
    updated:
      state.bankState.bankSavingsUpdated ||
      state.bankState.bankIncomeUpdated ||
      state.bankState.bankExpensesUpdated ||
      state.bankState.bankOthersUpdated ||
      state.bankState.bankHeadersUpdated,
  };
};

export default connect(mapStateToProps)(NavBarItem);
