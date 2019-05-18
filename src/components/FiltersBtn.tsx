import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import _ from 'lodash';
import React from 'react';
import { connect } from 'react-redux';
import { Dropdown, DropdownMenu, DropdownToggle } from 'reactstrap';

import Bank, { ISavingsHeader } from '../bank';
import { AppState } from '../store';
import ClickableItem from './ClickableItem';

interface IProps {
  bankUpdated: boolean;
  bank: Bank.IBank;
}

interface IState {
  dropdownOpen: boolean;
}

class FiltersBtn extends React.Component<IProps, IState> {
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

  render() {
    const { bankUpdated, bank } = this.props;

    return (
      <Dropdown isOpen={this.state.dropdownOpen} toggle={this.toggle} className="mr-2">
        <DropdownToggle color="outline-light">
          <FontAwesomeIcon icon="columns" />
        </DropdownToggle>
        <DropdownMenu>
          {bank.savingsInputs.map((header: ISavingsHeader, key: number) => (
            <ClickableItem key={key} header={header} {...this.props} />
          ))}
          {/* <DropdownItem divider />
          <ClickableItem header={{id: 'total', type:'T'}} bank={bank} /> */}
        </DropdownMenu>
      </Dropdown>
    );
  }
}

const mapStateToProps = (state: AppState) => {
  return ({
    bank: state.bankState.bank,
    bankUpdated: state.bankState.bankUpdated,
  });
}

export default connect(mapStateToProps)(FiltersBtn);
