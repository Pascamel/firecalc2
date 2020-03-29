import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { Dispatch, useState } from 'react';
import { connect } from 'react-redux';
import {
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownToggle
} from 'reactstrap';

import { updateValueLocalStorage } from '../actions';
import Bank from '../bank';
import { AppState } from '../store';

interface IProps {
  bank: Bank.IBank;
  onUpdateValueLocalStorage: (
    index: string,
    indexes: string[],
    amount: number | boolean
  ) => void;
}

const DecimalsBtn = (props: IProps) => {
  const { bank, onUpdateValueLocalStorage } = props;
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const toggle = () => {
    setDropdownOpen(!dropdownOpen);
  };

  const clickDecimal = (decimal: boolean) => {
    onUpdateValueLocalStorage('showDecimals', [], decimal);
  };

  return (
    <Dropdown isOpen={dropdownOpen} toggle={toggle}>
      <DropdownToggle color="outline-light">
        <FontAwesomeIcon icon="university" />
      </DropdownToggle>
      <DropdownMenu>
        <DropdownItem
          disabled={bank.showDecimals}
          onClick={() => clickDecimal(true)}
        >
          Decimals
        </DropdownItem>
        <DropdownItem
          disabled={!bank.showDecimals}
          onClick={() => clickDecimal(false)}
        >
          Rounded
        </DropdownItem>
      </DropdownMenu>
    </Dropdown>
  );
};

const mapStateToProps = (state: AppState) => {
  return {
    bank: state.bankState.bank
  };
};

const mapDispatchToProps = (dispatch: Dispatch<any>) => {
  return {
    onUpdateValueLocalStorage: (
      index: string,
      indexes: string[],
      amount: number | boolean
    ) => {
      dispatch(updateValueLocalStorage(index, indexes, amount));
    }
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(DecimalsBtn);
