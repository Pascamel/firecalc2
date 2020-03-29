import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useState } from 'react';
import { connect } from 'react-redux';
import { Dropdown, DropdownMenu, DropdownToggle } from 'reactstrap';

import Bank from '../bank';
import { AppState } from '../store';
import { ClickableItem } from '.';

interface IProps {
  bank: Bank.IBank;
}

const FiltersBtn = (props: IProps) => {
  const { bank } = props;
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const toggle = () => {
    setDropdownOpen(!dropdownOpen);
  };

  return (
    <Dropdown isOpen={dropdownOpen} toggle={toggle} className="mr-2">
      <DropdownToggle color="outline-light">
        <FontAwesomeIcon icon="columns" />
      </DropdownToggle>
      <DropdownMenu>
        {bank.savingsInputs.map((header, key: number) => (
          <ClickableItem key={key} header={header} />
        ))}
        {/* <DropdownItem divider />
        <ClickableItem header={{id: 'total', type:'T'}} bank={bank} /> */}
      </DropdownMenu>
    </Dropdown>
  );
};

const mapStateToProps = (state: AppState) => {
  return {
    bank: state.bankState.bank
  };
};

export default connect(mapStateToProps)(FiltersBtn);
