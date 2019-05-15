import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { Dispatch } from 'react';
import { connect } from 'react-redux';
import { Dropdown, DropdownItem, DropdownMenu, DropdownToggle } from 'reactstrap';

import { updateValue } from '../actions';
import * as Bank from '../bank';

interface IProps {
  bankUpdated: boolean, 
  bank: Bank.IBank,
  onUpdateValue: (index: string, indexes: string[], amount: boolean) => void
}

interface IState {
  dropdownOpen: boolean
}

class DecimalsBtn extends React.Component<IProps, IState> {
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
    this.props.onUpdateValue('showDecimals', [], decimal);
  }

  render() {
    const { bank, bankUpdated } = this.props;

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

const mapStateToProps = (state: any) => {
  return ({
    bank: state.bankState.bank,
    bankUpdated: state.bankState.bankUpdated,
  });
}

const mapDispatchToProps = (dispatch: Dispatch<any>) => {
  return {
    onUpdateValue: (index: string, indexes: string[], amount: boolean) => {
      dispatch(updateValue(index, indexes, amount));
    }
  };
};

export default connect(
  mapStateToProps, 
  mapDispatchToProps
)(DecimalsBtn);
