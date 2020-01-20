import _ from 'lodash';
import math from 'mathjs';
import React, { Dispatch, useEffect, useState } from 'react';
import { connect } from 'react-redux';

import { updateValue } from '../actions';
import Bank from '../bank';
import { Text } from '../components';
import helpers from '../helpers';
import { AppState } from '../store';

interface IProps {
  bank: Bank.IBank;
  extraClassName?: string;
  ['callback-props']: string[];
  ['display-if-zero']?: boolean;
  onUpdateValue: (index: string, indexes: string[], amount: number) => void;
}

interface IState {
  edit: boolean;
  extraClassName: string;
  readonly: boolean;
  amount: number;
  inputValue: string;
  displayIfZero: boolean;
}

const FireAmount = (props: IProps) => {
  const { bank, onUpdateValue } = props;
  const [readonly,] = useState(_.last(props['callback-props']) === 'T');
  const [extraClassName,] = useState(props.extraClassName || '');
  const [edit, setEdit] = useState(false);
  const [amount, setAmount] = useState(_.get(props.bank, props['callback-props'], 0));
  const [inputValue, setInputValue] = useState(_.get(props.bank, props['callback-props'], 0) ? _.get(props.bank, props['callback-props'], 0).toString() : '');
  const [displayIfZero,] = useState(props['display-if-zero'] || false);
    
  const setEditMode = () => {
    if (readonly) return;

    setEdit(true);
    setAmount(_.get(bank, props['callback-props'], 0));
  }

  const confirmEdit = () => {
    const s = (inputValue || '').replace(',','').replace('$','');

    if (!RegExp('^([0-9()*/.+-])+$').test(s)) return;
  
    const val = (math.eval(s) || 0).toString();

    setEdit(false);
    setAmount(val);

    const indexes = props['callback-props'];
    const index = indexes.shift() || '';

    onUpdateValue(index, indexes, parseFloat(val) || 0);
  }

  const cancelEdit = () => {
    setEdit(false);
  }

  const handleKeyUp = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (!edit) return;

    if (event.key === 'Enter') confirmEdit();
    if (event.key === 'Escape') cancelEdit();
  }

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (!edit) return;

    if (event.key === 'Enter') confirmEdit();
    if (event.key === 'Escape') cancelEdit();
  }

  useEffect(() => {
    setEdit(false);
    setAmount(_.get(bank, props['callback-props'], 0));
    setInputValue(_.get(bank, props['callback-props'], 0) ? _.get(bank, props['callback-props'], 0).toString() : '');
  }, [bank, props])

  return (
    <div className={`amount-container ${readonly ? 'read-only' : ''} ${extraClassName}`} onKeyDown={handleKeyDown}>
      {!edit && <Text className="amount" onClick={setEditMode}>
        {helpers.amount(amount, displayIfZero, bank.showDecimals || false)}
      </Text>}
      {edit && <input
        ref={(input) => {if (input != null) input.focus();}}
        className="form-control"
        defaultValue={amount ? amount.toString() : ''} 
        onChange={e => setInputValue(e.target.value)} 
        onKeyUp={handleKeyUp}  
      />}
    </div>
  );
}

const mapStateToProps = (state: AppState) => {
  return ({
    bank: state.bankState.bank
  });
}

const mapDispatchToProps = (dispatch: Dispatch<any>) => {
  return {
    onUpdateValue: (index: string, indexes: string[], amount: number) => {
      dispatch(updateValue(index, indexes, amount));
    }
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(FireAmount);
