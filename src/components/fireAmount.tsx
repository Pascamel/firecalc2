import _ from 'lodash';
import math from 'mathjs';
import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { AnyAction } from 'redux';
import { ThunkDispatch } from 'redux-thunk';

import { updateValue } from '../actions';
import Bank from '../bank';
import { Text } from '../components';
import { amount as helper_amount, joinFilter } from '../helpers';
import { AppState } from '../store';

interface IProps {
  bank: Bank.IBank;
  extraClassName?: string;
  classNameInput?: string;
  ['callback-props']: string[];
  ['display-if-zero']?: boolean;
  onUpdateValue: (
    index: string,
    indexes: string[],
    label: string,
    previous: number,
    amount: number
  ) => void;
}

const FireAmount = ({
  bank,
  extraClassName,
  classNameInput,
  'callback-props': callbackProps,
  'display-if-zero': displayIfZero,
  onUpdateValue,
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
  }, [bank, callbackProps]);

  const setEditMode = () => {
    if (readonly) {
      return;
    }

    setEdit(true);
    setAmount(_.get(bank, callbackProps, 0));
  };

  const onClick = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e && e.stopPropagation();
    setEditMode();
  };

  const v4 = new RegExp(
    /^[0-9A-F]{8}-[0-9A-F]{4}-4[0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i
  );

  const confirmEdit = () => {
    const s = (inputValue || '').replace(',', '').replace('$', '');

    if (!RegExp('^([0-9()*/.+-])+$').test(s)) return;

    const val = (math.eval(s) || 0).toString();
    const previousAmount = amount;
    setEdit(false);
    setAmount(val);

    const indexes = callbackProps;
    const index = indexes.shift() || '';

    onUpdateValue(
      index,
      indexes,
      [index, ...indexes]
        .map((s) => {
          if (!v4.test(s)) {
            return s;
          }
          if (index === 'savings') {
            return _(bank.savingsHeaders).keyBy('id').get([s, 'label']);
          }
          if (index === 'income') {
            return _(bank.incomeHeaders).keyBy('id').get([s, 'label']);
          }
          if (index === 'expenses') {
            return _(bank.expensesHeaders).keyBy('id').get([s, 'label']);
          }
          return s;
        })
        .filter((s) => s?.length > 0)
        .filter((s) => !v4.test(s))
        .join(' > '),
      parseFloat(previousAmount),
      parseFloat(val) || 0
    );
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

  return (
    <div
      className={joinFilter(
        'amount-container',
        readonly ? 'read-only' : null,
        extraClassName
      )}
      onKeyDown={handleKeyDown}
    >
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
          ref={(input) => {
            input?.focus();
          }}
          className={`form-control ${classNameInput}`}
          defaultValue={amount ? amount.toString() : ''}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyUp={handleKeyUp}
        />
      )}
    </div>
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
    onUpdateValue: (
      index: string,
      indexes: string[],
      label: string,
      previous: number,
      amount: number
    ) => {
      dispatch(updateValue(index, indexes, label, previous, amount));
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(FireAmount);
