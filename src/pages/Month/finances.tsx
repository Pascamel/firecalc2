import _ from 'lodash';
import React from 'react';
import { connect } from 'react-redux';
import { Alert, Col } from 'reactstrap';

import * as Bank from '../../bank';
import { ISavingsHeader } from '../../bank/interfaces';
import { StaticAmount } from '../../components';
import { AppState } from '../../store';
import MonthIncome from './monthIncome';
import MonthSavings from './monthSavings';

interface IProps {
  bank: Bank.IBank;
  month: string;
  year: string;
}

class MonthFinances extends React.Component<IProps> {
  render() {
    const { month, year, bank } = this.props;

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
            {bank.savingsInputs.filter((header: ISavingsHeader) => header.type !== 'T').map((header: any, key: string) => (
              <MonthSavings key={key} header={header} {...this.props} />
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
            {bank.incomeHeaders.map((header: any, key: string) => (
              <MonthIncome key={key} header={header} {...this.props} />
            ))}
          </Alert>
        </Col>
      </React.Fragment>
    );
  }
}

const mapStateToProps = (state: AppState) => {
  return ({
    bank: state.bankState.bank
  });
}

export default connect(mapStateToProps)(MonthFinances);
