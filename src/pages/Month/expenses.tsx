import _ from 'lodash';
import React from 'react';
import { connect } from 'react-redux';
import { Alert, Col } from 'reactstrap';

import Bank from '../../bank';
import { PanelTitle, Text } from '../../components';
import { amount } from '../../helpers';
import { AppState } from '../../store';
import Expense from './expense';

interface IProps {
  bank: Bank.IBank;
  month: string;
  year: string;
}

const Expenses = ({ month, year, bank }: IProps) => {
  const automatic_expenses =
    _.get(bank.totalMonthIncome, [year, month], 0) -
    _.get(bank.totalMonthSavings, [year, month], 0);

  return (
    <Col md={4} sm={12}>
      <Alert color="background">
        <PanelTitle
          title="Expenses"
          subTitle={`$${amount(
            _.get(bank.totalMonthExpenses, [year, month], 0),
            true,
            bank.showDecimals
          )}`}
        />
        {bank.expensesInputs.map((header, key) => (
          <Expense key={key} header={header} month={month} year={year} />
        ))}
        <hr />
        <div className="month-amount">
          <Text className="label-fake-input smaller mb-1">
            Automatic Expenses
          </Text>
          <div className="pull-right pt-1">
            <Text className="amount">
              {amount(automatic_expenses, true, bank.showDecimals)}
            </Text>
          </div>
        </div>
      </Alert>
    </Col>
  );
};

const mapStateToProps = (state: AppState) => {
  return {
    bank: state.bankState.bank,
  };
};

export default connect(mapStateToProps)(Expenses);
