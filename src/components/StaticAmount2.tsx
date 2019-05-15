import _ from 'lodash';
import React from 'react';
import { connect } from 'react-redux';

import * as Bank from '../bank';
import helpers from '../helpers';

interface IProps {
  children: number,
  bank: Bank.IBank
  ['display-zero']?: boolean
}

class StaticAmount2 extends React.Component<IProps, {}> {
  render () {
    const daz = _.has(this.props, 'display-zero');
    const value: number = this.props.children || 0;

    return (
      <React.Fragment>
        {helpers.amount(this.props.children, daz, this.props.bank.showDecimals)} 
      </React.Fragment>
    );
  }
}

const mapStateToProps = (state: any) => {
  return ({
    bank: state.bankState.bank
  });
}

export default connect(mapStateToProps)(StaticAmount2);
