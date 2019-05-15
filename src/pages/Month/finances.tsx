import _ from 'lodash';
import React from 'react';
import { connect } from 'react-redux';
import { Alert, Col } from 'reactstrap';

import * as Bank from '../../bank';
import { StaticAmount } from '../../components';
import MonthIncome from './monthIncome';
import MonthSavings from './monthSavings';

interface IProps {
  bank: Bank.IBank,
  month: string,
  year: string, 
  callbackSavings: (index: string, indexes: string[], amount: any, updatedState: boolean) => void, 
  callbackIncome: (index: string, indexes: string[], amount: any, updatedState: boolean) => void
}

class MonthFinances extends React.Component<IProps> {
  render() {
    const { month, year, bank, callbackSavings, callbackIncome } = this.props;

    return (
      <React.Fragment>
        <Col md={4} sm={12}>

        <Alert color="background">
          <h3>
            Savings
            <span className="pull-right text-secondary font-weight-normal">
              $
              <StaticAmount bank={bank} display-zero>
                {_.get(bank.totalMonthSavings, [year, month], 0)}
              </StaticAmount>
            </span>
          </h3>
          <hr />
          {bank.savingsInputs.filter((header: any) => header.type!=='T')
            .map((header: any, key: string) => (
            <MonthSavings key={key} 
                          header={header}
                          data={_.get(bank.savings, [year, month])}
                          callback={callbackSavings}
                          {...this.props} />
                        
          ))}
          </Alert>
        </Col>
        <Col md={4} sm={12}>
          <Alert color="background">
            <h3>
              Income
              <span className="pull-right text-secondary font-weight-normal">
                $
                <StaticAmount bank={bank} display-zero>
                  {_.get(bank.totalMonthIncome, [year, month], 0)}
                </StaticAmount>
              </span>
            </h3>
            <hr />
            {bank.incomeHeaders.map((header: any, key: string) => (
              <MonthIncome key={key} 
                          header={header} 
                          data={_.get(bank.income, [year, month])} 
                          callback={callbackIncome} 
                          {...this.props} />
            ))}
          </Alert>
        </Col>
      </React.Fragment>
    );
  }
}

const mapStateToProps = (state: any) => {
  return ({
    bank: state.bankState.bank
  });
}

export default connect(mapStateToProps)(MonthFinances);
