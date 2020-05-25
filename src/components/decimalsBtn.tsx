import React, { useState } from 'react';
import { connect } from 'react-redux';
import { Dropdown, DropdownItem, DropdownMenu, DropdownToggle } from 'reactstrap';
import { AnyAction } from 'redux';
import { ThunkDispatch } from 'redux-thunk';

import { updateValueLocalStorage } from '../actions';
import Bank from '../bank';
import { Icon } from '../components';
import { AppState } from '../store';

interface IProps {
  bank: Bank.IBank;
  onUpdateValueLocalStorage: (
    index: string,
    indexes: string[],
    label: string,
    previous: boolean,
    amount: boolean
  ) => void;
}

const DecimalsBtn = ({ bank, onUpdateValueLocalStorage }: IProps) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const toggle = () => {
    setDropdownOpen(!dropdownOpen);
  };

  const clickDecimal = (decimal: boolean) => {
    onUpdateValueLocalStorage(
      'showDecimals',
      [],
      'Bank > Show Decimals',
      !decimal,
      decimal
    );
  };

  return (
    <Dropdown isOpen={dropdownOpen} toggle={toggle}>
      <DropdownToggle color="outline-light">
        <Icon icon="university" />
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
    bank: state.bankState.bank,
  };
};

const mapDispatchToProps = (
  dispatch: ThunkDispatch<AppState, void, AnyAction>
) => {
  return {
    onUpdateValueLocalStorage: (
      index: string,
      indexes: string[],
      label: string,
      previous: number | boolean,
      amount: number | boolean
    ) => {
      dispatch(
        updateValueLocalStorage(index, indexes, label, previous, amount)
      );
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(DecimalsBtn);
