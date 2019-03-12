import React from 'react';
import _ from 'lodash';
import MonthSavings from './monthSavings';
import MonthIncome from './monthIncome';
import { Bank } from '../../bank';
import { Col } from 'reactstrap';

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
          <h3>Savings</h3>
          {bank.savingsInputs.filter((header: any) => header.type!=='T')
            .map((header: any, key: string) => (
            <MonthSavings key={key} 
                          header={header}
                          data={_.get(bank.savings, [year, month])}
                          callback={callbackSavings}
                          {...this.props} />
                        
          ))}
        </Col>
        <Col md={4} sm={12}>
          <h3>Income</h3>
          {bank.incomeHeaders.map((header: any, key: string) => (
            <MonthIncome key={key} 
                         header={header} 
                         data={_.get(bank.income, [year, month])} 
                         callback={callbackIncome} 
                         {...this.props} />
          ))}
        </Col>
      </React.Fragment>
    );
  }
}
