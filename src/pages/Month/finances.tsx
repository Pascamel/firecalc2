import React from 'react';
import { Alert, Col } from 'reactstrap';
import _ from 'lodash';
import MonthSavings from './monthSavings';
import MonthIncome from './monthIncome';
import { Bank } from '../../bank';
import { StaticAmount } from '../../components';


interface IProps {
  bank: Bank,
  month: string,
  year: string, 
  callbackSavings: (index: string, indexes: string[], amount: any, updatedState: boolean) => void, 
  callbackIncome: (index: string, indexes: string[], amount: any, updatedState: boolean) => void
}

export default class MonthFinances extends React.Component<IProps> {
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
                {_.get(bank.totalMonthSavings, [year, month])}
              </StaticAmount>
            </span>
          </h3>
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
                  {_.get(bank.totalMonthIncome, [year, month])}
                </StaticAmount>
              </span>
            </h3>
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
