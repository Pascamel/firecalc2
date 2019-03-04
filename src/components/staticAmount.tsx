import React, { Component } from 'react';
import { Bank } from '../bank';
import helpers from '../helpers';

interface IProps {
  children: number,
  bank: Bank
  ['display-zero']?: boolean
}

export default class StaticAmount extends Component<IProps, {}> {

  render () {
    const daz = this.props['display-zero'] || false;

    return (
      <React.Fragment>
        {helpers.amount(Math.abs(this.props.children), daz, this.props.bank.showDecimals)} 
      </React.Fragment>
    );
  }
}