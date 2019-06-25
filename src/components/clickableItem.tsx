import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import _ from 'lodash';
import React, { Dispatch, useState } from 'react';
import { connect } from 'react-redux';
import { DropdownItem } from 'reactstrap';

import { updateValueLocalStorage } from '../actions';
import Bank from '../bank';
import * as formatters from '../bank/formatters';
import { AppState } from '../store';

interface IProps {
  header: {id: string, type: string};
  bank: Bank.IBank;
  onUpdateValueLocalStorage: (index: string, indexes: string[], amount: number|boolean) => void;
}

const ClickableItem = (props: IProps) => {
  const { header, bank, onUpdateValueLocalStorage } = props;
    
  let hl = '';
  if (header.id === 'total') {
    hl = 'Totals';
  } else {
    const h = _(bank.savingsHeaders).keyBy('id').get([header.id]);

    let header_label = h.label || 'N/A';
    if (h.sublabel) header_label += ' > ' + h.sublabel;
    if (h.interest) header_label += ' > ' + formatters.labelSavings(header.type);

    hl = header_label;
  }

  const [headerLabel] = useState(hl);
  const [hidden, setHidden] = useState(_.get(bank, ['savingsHeadersHidden', header.id, header.type], false));

  const clickColumn = () => {
    setHidden(!hidden)
    onUpdateValueLocalStorage('savingsHeadersHidden', [header.id, header.type], !hidden);
  }

  return (
    <DropdownItem toggle={false} onClick={clickColumn} className={hidden ? 'text-muted' : ''}>
      <FontAwesomeIcon icon={hidden ? 'eye-slash' : 'eye'} className="mr-2" />
      {headerLabel}
    </DropdownItem>
  );
}

const mapStateToProps = (state: AppState) => {
  return ({
    bank: state.bankState.bank
  });
}

const mapDispatchToProps = (dispatch: Dispatch<any>) => {
  return {
    onUpdateValueLocalStorage: (index: string, indexes: string[], amount: number|boolean) => {
      dispatch(updateValueLocalStorage(index, indexes, amount));
    }
  };
};

export default connect(
  mapStateToProps, 
  mapDispatchToProps
)(ClickableItem);
