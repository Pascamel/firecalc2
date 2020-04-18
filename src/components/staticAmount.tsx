import React from 'react';
import { connect } from 'react-redux';

import Bank from '../bank';
import { amount } from '../helpers';
import { AppState } from '../store';

interface IProps {
  children: number;
  bank: Bank.IBank;
  ['display-zero']?: boolean;
  ['hide-decimals']?: boolean;
}

const StaticAmount = (props: IProps) => {
  const { children, bank } = props;
  const daz = 'display-zero' in props;
  const hd = 'hide-decimals' in props;

  return <>{amount(children, daz, !hd && bank.showDecimals)}</>;
};

const mapStateToProps = (state: AppState) => {
  return {
    bank: state.bankState.bank
  };
};

export default connect(mapStateToProps)(StaticAmount);
