import React, { Component } from 'react';
import { Bank } from '../bank';
import helpers from '../helpers';
import _ from 'lodash';

interface IAmountProps {
  children: number,
  bank: Bank
  ['display-zero']?: boolean
}

export class StaticAmount extends Component<IAmountProps, {}> {
  render () {
    const daz = _.has(this.props, 'display-zero');
    const value: number = this.props.children || 0;

    return (
      <React.Fragment>
        {helpers.amount(/*Math.abs(*/this.props.children/*)*/, daz, this.props.bank.showDecimals)} 
      </React.Fragment>
    );
  }
}

interface IPercentageProps {
  children: number
}

export class StaticPercentage extends Component<IPercentageProps, {}> {
  render() {
    return (
      <React.Fragment>
        {helpers.percentage(this.props.children)}
      </React.Fragment>
    );
  }
}