import _ from 'lodash';
import React from 'react';
import { connect } from 'react-redux';

import Bank, { IIncomeHeader } from '../../bank';
import { FireAmount, Text } from '../../components';
import { AppState } from '../../store';

interface IProps {
  bank: Bank.IBank;
  header: IIncomeHeader;
  month: string;
  year: string;
}

const MonthIncome = ({ header, bank, month, year }: IProps) => (
  <div className="month-amount">
    <Text className="label-fake-input smaller mb-1">
      {_(bank.incomeHeaders)
        .keyBy('id')
        .get([header.id, 'label'], 'N/A')}
    </Text>
    <div className="pull-right">
      <FireAmount
        extraClassName="label-fake-input"
        display-if-zero={true}
        callback-props={['income', year, month, header.id]}
      />
    </div>
  </div>
);

const mapStateToProps = (state: AppState) => {
  return {
    bank: state.bankState.bank
  };
};

export default connect(mapStateToProps)(MonthIncome);
