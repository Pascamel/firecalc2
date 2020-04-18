import _ from 'lodash';
import math from 'mathjs';
import React, { Dispatch, useEffect, useState } from 'react';
import { connect } from 'react-redux';

import { updateValue } from '../actions';
import Bank from '../bank';
import { Text } from '../components';
import { amount as helper_amount } from '../helpers';
import { AppState } from '../store';

interface IProps {
  bank: Bank.IBank;
  extraClassName?: string;
  ['callback-props']: string[];
  ['display-if-zero']?: boolean;
  onUpdateValue: (index: string, indexes: string[], amount: number) => void;
  clickEditParent?: string;
}

const FireAmount = ({
  bank,
  extraClassName,
  'callback-props': callbackProps,
  'display-if-zero': displayIfZero,
  onUpdateValue,
  clickEditParent
}: IProps) => {
  const readonly = _.last(callbackProps) === 'T';
  const [edit, setEdit] = useState(false);
  const [amount, setAmount] = useState(_.get(bank, callbackProps, 0));
  const [inputValue, setInputValue] = useState(
    _.get(bank, callbackProps, 0).toString()
  );

  useEffect(() => {
    setEdit(false);
    setAmount(_.get(bank, callbackProps, 0));
    setInputValue(_.get(bank, callbackProps, 0).toString());
  }, [bank]);

  useEffect(() => {
    if (clickEditParent !== null) {
      setEditMode();
    }
  }, [clickEditParent]);

  const onClick = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e && e.stopPropagation();
    setEditMode();
  };

  const setEditMode = (e?: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    if (readonly) return;

    setEdit(true);
    setAmount(_.get(bank, callbackProps, 0));
  };

  const confirmEdit = () => {
    const s = (inputValue || '').replace(',', '').replace('$', '');

    if (!RegExp('^([0-9()*/.+-])+$').test(s)) return;

    const val = (math.eval(s) || 0).toString();

    setEdit(false);
    setAmount(val);

    const indexes = callbackProps;
    const index = indexes.shift() || '';

    onUpdateValue(index, indexes, parseFloat(val) || 0);
  };

  const cancelEdit = () => {
    setEdit(false);
  };

  const handleKeyUp = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (!edit) return;

    if (event.key === 'Enter') confirmEdit();
    if (event.key === 'Escape') cancelEdit();
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (!edit) return;

    if (event.key === 'Enter') confirmEdit();
    if (event.key === 'Escape') cancelEdit();
  };

  const classname = [
    'amount-container',
    readonly ? 'read-only' : null,
    extraClassName
  ]
    .filter(v => v !== null)
    .join(' ');

  return (
    <div className={classname} onKeyDown={handleKeyDown}>
      {!edit && (
        <Text className="amount" onClick={onClick}>
          {helper_amount(
            amount,
            displayIfZero || false,
            bank.showDecimals || false
          )}
        </Text>
      )}
      {edit && (
        <input
          ref={input => {
            input?.focus();
          }}
          className="form-control"
          defaultValue={amount ? amount.toString() : ''}
          onChange={e => setInputValue(e.target.value)}
          onKeyUp={handleKeyUp}
        />
      )}
    </div>
  );
};

const mapStateToProps = (state: AppState) => {
  return {
    bank: state.bankState.bank
  };
};

const mapDispatchToProps = (dispatch: Dispatch<any>) => {
  return {
    onUpdateValue: (index: string, indexes: string[], amount: number) => {
      dispatch(updateValue(index, indexes, amount));
    }
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(FireAmount);
