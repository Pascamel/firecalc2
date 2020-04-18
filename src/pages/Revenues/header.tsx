import React from 'react';
import { connect } from 'react-redux';

import Bank from '../../bank';
import { AppState } from '../../store';

interface IProps {
  bank: Bank.IBank;
}

const Header = ({ bank }: IProps) => {
  return (
    <thead>
      <tr>
        <th></th>
        <th className="separator" colSpan={bank.incomeHeaders.length}>
          Revenues
        </th>
        <th className="separator" colSpan={2}>
          Total
        </th>
        <th className="perf">Perf</th>
      </tr>
      <tr>
        <th></th>
        {bank.incomeHeaders.map(header => (
          <th key={header.id} className={header.last ? 'separator' : ''}>
            {header.label}
          </th>
        ))}
        <th>Post</th>
        <th className="separator">Pre</th>
        <th>SR</th>
      </tr>
    </thead>
  );
};

const mapStateToProps = (state: AppState) => {
  return {
    bank: state.bankState.bank
  };
};

export default connect(mapStateToProps)(Header);
