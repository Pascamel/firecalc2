import _ from 'lodash';
import React from 'react';
import { connect } from 'react-redux';

import Bank from '../bank';
import helpers from '../helpers';
import { AppState } from '../store';

interface IProps {
  children: number;
  bank: Bank.IBank;
  ['display-zero']?: boolean;
  ['hide-decimals']?: boolean;
}

const StaticAmount = (props: IProps) => {
  const { children, bank } = props;
  const daz = _.has(props, 'display-zero');
  const hd = _.has(props, 'hide-decimals');

  return <>{helpers.amount(children, daz, !hd && bank.showDecimals)}</>;
};

const mapStateToProps = (state: AppState) => {
  return {
    bank: state.bankState.bank
  };
};

export default connect(mapStateToProps)(StaticAmount);
