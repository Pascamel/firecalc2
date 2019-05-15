import React from 'react';

import * as Bank from '../../bank';

interface IProps {
  bank: Bank.IBank
}

interface IState {

}

export default class Header extends React.Component<IProps, IState> {
  render () {
    const {bank} = this.props;

    return (
      <thead>
        <tr>
          <th></th>
          <th className="separator" colSpan={bank.incomeHeaders.length}>Revenues</th>
          <th className="separator" colSpan={2}>Total</th>
          <th className="perf">Perf</th>
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
