import React, { Component } from 'react';
import { Bank } from '../../bank';

interface IProps {
  bank: Bank
}

interface IState {

}

export default class Header extends Component<IProps, IState> {
  render () {
    const {bank} = this.props;

    return (
      <thead>
        <tr>
          <th></th>
          <th className="separator" colSpan={bank.incomeHeaders.length}>Revenues</th>
          <th className="separator" colSpan={2}>Total</th>
          <th colSpan={1} style={{width: '70px'}}>Perf</th>
        </tr>
        <tr>
          <th></th>
          {bank.incomeHeaders.map((header: any) => (
            <th key={header.id} className={header.last ? 'separator' : ''}>{header.label}</th>
          ))}
          <th>Post</th>
          <th className="separator">Pre</th>
          <th>SR</th>
        </tr>
      </thead>
    );    
  }
}
