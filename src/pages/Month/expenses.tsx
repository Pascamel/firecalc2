import _ from 'lodash';
import React from 'react';
import { connect } from 'react-redux';
import { Alert, Col } from 'reactstrap';

import Bank from '../../bank';
import { PanelTitle } from '../../components';
import { amount } from '../../helpers';
import { AppState } from '../../store';
import Expense from './expense';

interface IProps {
  bank: Bank.IBank;
  month: string;
  year: string;
}

const Expenses = ({ month, year, bank }: IProps) => {
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
