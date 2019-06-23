import _ from 'lodash';
import React from 'react';
import { connect } from 'react-redux';
import { Alert, Col } from 'reactstrap';

import Bank from '../../bank';
import { StaticAmount } from '../../components';
import { AppState } from '../../store';
import MonthIncome from './monthIncome';
import MonthSavings from './monthSavings';

interface IProps {
  bank: Bank.IBank;
  month: string;
  year: string;
}

const MonthFinances = (props: IProps) => {
  const { month, year, bank } = props;

  return (
    <React.Fragment>
      <Col md={4} sm={12}>
        <Alert color="background">
          <h3>
            Savings
            <span className="pull-right text-secondary font-weight-normal">
              $
              <StaticAmount display-zero>
                {_.get(bank.totalMonthSavings, [year, month], 0)}
              </StaticAmount>
            </span>
          </h3>
          <hr />
          {bank.savingsInputs.filter((header) => header.type !== 'T').map((header, key) => (
            <MonthSavings key={key} header={header} month={month} year={year} />
          ))}
        </Alert>
      </Col>
      <Col md={4} sm={12}>
        <Alert color="background">
          <h3>
            Income
            <span className="pull-right text-secondary font-weight-normal">
              $
              <StaticAmount display-zero>
                {_.get(bank.totalMonthIncome, [year, month], 0)}
              </StaticAmount>
            </span>
          </h3>
          <hr />
          {bank.incomeHeaders.map((header, key) => (
            <MonthIncome key={key} header={header} month={month} year={year} />
          ))}
        </Alert>
      </Col>
    </React.Fragment>
  );
}

const mapStateToProps = (state: AppState) => {
  return ({
    bank: state.bankState.bank
  });
}

export default connect(mapStateToProps)(MonthFinances);
