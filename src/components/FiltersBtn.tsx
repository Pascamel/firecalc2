import React from 'react';
import { Dropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap';
import _ from 'lodash';
import * as I from '../bank/interfaces';
import { Bank } from '../bank';
import * as formatters from '../bank/formatters';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';


interface IFiltersBtnProps {
  updated: boolean,
  bank: Bank,
  callback: (index: string, indexes: string[], amount: any, updatedState: boolean) => void
}

interface IFiltersBtnState {
  dropdownOpen: boolean
}

export class FiltersBtn extends React.Component<IFiltersBtnProps, IFiltersBtnState> {
  constructor(props: IFiltersBtnProps) {
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

  render () {
    const {updated, bank} = this.props;

    return (
      <Dropdown isOpen={this.state.dropdownOpen} toggle={this.toggle} className="mr-2">
        <DropdownToggle color="header">
          <FontAwesomeIcon icon="columns" />
        </DropdownToggle>
        <DropdownMenu>
          {bank.savingsInputs.map((header: I.ISavingsHeader, key: number) => (
            <ClickableItem key={key} header={header} {...this.props} />
          ))}
          {/* <DropdownItem divider />
          <ClickableItem header={{id: 'total', type:'T'}} bank={bank} /> */}
        </DropdownMenu>
      </Dropdown>
    );
  }
}

interface IClickableItemProps {
  header: {id: string, type: string},
  bank: Bank,
  callback: (index: string, indexes: string[], amount: any, updatedState: boolean) => void
}

interface IClickableItemState {
  header_label: string,
  hidden: boolean
}

class ClickableItem extends React.Component<IClickableItemProps, IClickableItemState> {
  constructor(props: IClickableItemProps) {
    super(props);
    
    let hl = '';
    if (props.header.id === 'total') {
      hl = 'Totals';
    } else {
      const h = _(props.bank.savingsHeaders).keyBy('id').get([props.header.id], 'N/A');

      let header_label = h.label || 'N/A';
      if (h.sublabel) header_label += ' > ' + h.sublabel;
      if (h.interest) header_label += ' > ' + formatters.labelSavings(props.header.type);

      hl = header_label;
    }

    this.state = {
      header_label: hl,
      hidden: _.get(props.bank, ['savingsHeadersHidden', this.props.header.id, this.props.header.type], false)
    };

    this.clickColumn = this.clickColumn.bind(this);
  }

  clickColumn () {
    this.props.callback('savingsHeadersHidden', [this.props.header.id, this.props.header.type], !this.state.hidden, false);
    this.setState({hidden: !this.state.hidden});
  }

  render() {
    return (
      <DropdownItem toggle={false} onClick={this.clickColumn} className={this.state.hidden ? 'text-muted' : ''}>
        <FontAwesomeIcon icon={this.state.hidden ? 'eye-slash' : 'eye'} className="mr-2" />
        {this.state.header_label}
      </DropdownItem>
    );
  }
}
