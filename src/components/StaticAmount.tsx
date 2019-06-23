import _ from 'lodash';
import React from 'react';
import { connect } from 'react-redux';

import Bank from '../bank';
import helpers from '../helpers';
import { AppState } from '../store';

interface IProps {
  children: number,
  bank: Bank.IBank
  ['display-zero']?: boolean
}

const StaticAmount = (props: IProps) => {
  const { children, bank } = props;
  const daz = _.has(props, 'display-zero');

  return (
    <React.Fragment>
      {helpers.amount(children, daz, bank.showDecimals)} 
    </React.Fragment>
  );
}

const mapStateToProps = (state: AppState) => {
  return ({
    bank: state.bankState.bank
  });
}

export default connect(mapStateToProps)(StaticAmount);
