import React from 'react';
import { connect } from 'react-redux';

import Bank from '../../bank';
import { AppState } from '../../store';

interface IProps {
  bank: Bank.IBank
}

const Header = (props: IProps) => {
  const { bank } = props;

  return (
    <thead>
      <tr>
        <th></th>
        {bank.savingsHeadersLine1.map((h1, idx: number) => (
        <th className="separator" colSpan={h1.weight} key={idx}>
          {!h1.icon && <span>{h1.label}</span>}
          {h1.icon && <img src={h1.icon} alt="Institution" width="16" />}
        </th>
        ))}
        <th className="separator" colSpan={2}>Total</th>
        <th colSpan={3}>Goal</th>
      </tr>
      <tr>
        <th></th>
        {bank.savingsHeadersLine2.map((h2, idx: number) => (
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

const mapStateToProps = (state: AppState) => {
  return ({
    bank: state.bankState.bank
  });
}

export default connect(mapStateToProps)(Header);
