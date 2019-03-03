import React, { Component } from 'react';
import helpers from '../../helpers';
import { Bank } from '../../bank';

interface IProps {
  bank: Bank
}

interface IState {}

export default class Header extends Component<IProps, IState> {
  render() {
    const { bank } = this.props;

    return (
      <thead>
        <tr>
          <th></th>
          {bank.savingsHeadersLine1.map((h1: any, idx: number) => (
          <th className="separator" colSpan={h1.weight} key={idx}>
            <span className={helpers.hideIf(h1.icon)}>{h1.label}</span>
            <img src={h1.icon} alt="Institution" width="16" className={helpers.showIf(h1.icon)} />
          </th>
          ))}
          <th className="separator" colSpan={2}>Total</th>
          <th colSpan={3}>Goal</th>
        </tr>
        <tr>
          <th></th>
          {bank.savingsHeadersLine2.map((h2: any, idx: number) => (
          <th key={idx} className={h2.last ? 'separator' : ''}>{h2.label}</th>
          ))}
          <th>Month</th>
          <th className="separator">Total</th>
          <th>Month</th>
          <th>Total</th>
          <th>SR</th>
        </tr>
      </thead>
    );
  }
}
