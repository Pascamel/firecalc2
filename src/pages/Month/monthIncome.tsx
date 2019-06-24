import _ from 'lodash';
import React from 'react';
import { connect } from 'react-redux';

import Bank, { IIncomeHeader } from '../../bank';
import { FireAmount } from '../../components';
import { AppState } from '../../store';

interface IProps {
  bank: Bank.IBank;
  header: IIncomeHeader;
  month: string;
  year: string;
}

const MonthIncome = (props: IProps) => {
  const { header, bank, month, year } = props;
  const label = _(bank.incomeHeaders).keyBy('id').get([header.id, 'label'], 'N/A');
  
  return (
    <>
      <div className="month-amount">
        <span className="label-fake-input smaller mb-1">{label}</span>
        <div className="pull-right">
          <FireAmount extraClassName="label-fake-input" display-if-zero={true} callback-props={['income', year, month, header.id]} />
        </div>
      </div>
    </>
  );
}

const mapStateToProps = (state: AppState) => {
  return ({
    bank: state.bankState.bank
  });
}

export default connect(mapStateToProps)(MonthIncome);
