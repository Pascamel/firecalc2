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

class StaticAmount extends React.Component<IProps, {}> {
  render() {
    const daz = _.has(this.props, 'display-zero');

    return (
      <React.Fragment>
        {helpers.amount(this.props.children, daz, this.props.bank.showDecimals)} 
      </React.Fragment>
    );
  }
}

const mapStateToProps = (state: AppState) => {
  return ({
    bank: state.bankState.bank
  });
}

export default connect(mapStateToProps)(StaticAmount);
