import _ from 'lodash';
import React from 'react';

import * as Bank from '../bank';
import helpers from '../helpers';

interface IAmountProps {
  children: number,
  bank: Bank.IBank
  ['display-zero']?: boolean
}

export class StaticAmount extends React.Component<IAmountProps, {}> {
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

interface IPercentageProps {
  children: number
}

export class StaticPercentage extends React.Component<IPercentageProps, {}> {
  render() {
    return (
      <React.Fragment>
        {helpers.percentage(this.props.children)}
      </React.Fragment>
    );
  }
}