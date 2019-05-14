import React from 'react';
import { Dropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap';
import * as Bank from '../bank';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';


interface IProps {
  updated: boolean, 
  bank: Bank.IBank,
  callback: (index: string, indexes: string[], amount: any, updatedState: boolean) => void
}

interface IState {
  dropdownOpen: boolean
}

export default class DecimalsBtn extends React.Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);

    this.toggle = this.toggle.bind(this);
    this.state = {
      dropdownOpen: false
    };
  }

  toggle() {
    this.setState(prevState => ({
      dropdownOpen: !prevState.dropdownOpen
    }))
  }

  clickDecimal(decimal: boolean) {
    this.props.callback('showDecimals', [], decimal, false);
  }

  render () {
    const {updated, bank} = this.props;

    return (
      <Dropdown isOpen={this.state.dropdownOpen} toggle={this.toggle}>
        <DropdownToggle color="outline-light">
          <FontAwesomeIcon icon="university" />
        </DropdownToggle>
        <DropdownMenu>
          <DropdownItem disabled={bank.showDecimals} onClick={() => this.clickDecimal(true)}>Decimals</DropdownItem>
          <DropdownItem disabled={!bank.showDecimals} onClick={() => this.clickDecimal(false)}>Rounded</DropdownItem>
        </DropdownMenu>
      </Dropdown>
    );
  }
}
