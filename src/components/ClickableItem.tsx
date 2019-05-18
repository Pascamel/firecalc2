import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import _ from 'lodash';
import React, { Dispatch } from 'react';
import { connect } from 'react-redux';
import { DropdownItem } from 'reactstrap';

import { updateValueLocalStorage } from '../actions';
import Bank from '../bank';
import * as formatters from '../bank/formatters';

interface IProps {
  header: {id: string, type: string};
  bank: Bank.IBank;
  onUpdateValueLocalStorage: (index: string, indexes: string[], amount: number|boolean) => void;
}

interface IState {
  header_label: string;
  hidden: boolean;
}

class ClickableItem extends React.Component<IProps, IState> {
  constructor(props: IProps) {
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

  clickColumn() {
    this.setState({hidden: !this.state.hidden});
    this.props.onUpdateValueLocalStorage('savingsHeadersHidden', [this.props.header.id, this.props.header.type], !this.state.hidden);
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

const mapDispatchToProps = (dispatch: Dispatch<any>) => {
  return {
    onUpdateValueLocalStorage: (index: string, indexes: string[], amount: number|boolean) => {
      dispatch(updateValueLocalStorage(index, indexes, amount));
    }
  };
};

export default connect(null, mapDispatchToProps)(ClickableItem);
