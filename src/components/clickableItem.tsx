import _ from 'lodash';
import React, { useState } from 'react';
import { connect } from 'react-redux';
import { DropdownItem } from 'reactstrap';
import { AnyAction } from 'redux';
import { ThunkDispatch } from 'redux-thunk';

import { updateValueLocalStorage } from '../actions';
import Bank from '../bank';
import * as formatters from '../bank/formatters';
import { Icon } from '../components';
import { AppState } from '../store';

interface IProps {
  header: { id: string; type: string };
  bank: Bank.IBank;
  onUpdateValueLocalStorage: (
    index: string,
    indexes: string[],
    label: string,
    previous: boolean,
    amount: boolean
  ) => void;
}

const ClickableItem = ({ header, bank, onUpdateValueLocalStorage }: IProps) => {
  let hl = '';
  if (header.id === 'total') {
    hl = 'Totals';
  } else {
    const h = _(bank.savingsHeaders).keyBy('id').get([header.id]);

    let header_label = h.label || 'N/A';
    if (h.sublabel) header_label += ' > ' + h.sublabel;
    if (h.interest)
      header_label += ' > ' + formatters.labelSavings(header.type);

    hl = header_label;
  }

  const [headerLabel] = useState(hl);
  const [hidden, setHidden] = useState(
    _.get(bank, ['savingsHeadersHidden', header.id, header.type], false)
  );

  const clickColumn = () => {
    setHidden(!hidden);
    onUpdateValueLocalStorage(
      'savingsHeadersHidden',
      [header.id, header.type],
      hl,
      hidden,
      !hidden
    );
  };

  return (
    <DropdownItem
      toggle={false}
      onClick={clickColumn}
      className={hidden ? 'text-muted' : ''}
    >
      <Icon icon={hidden ? 'eye-slash' : 'eye'} className="mr-2" />
      {headerLabel}
    </DropdownItem>
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
      previous: boolean,
      amount: boolean
    ) => {
      dispatch(
        updateValueLocalStorage(index, indexes, label, previous, amount)
      );
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(ClickableItem);
