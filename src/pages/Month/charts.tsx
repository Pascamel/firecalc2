import React from 'react';
import { Row, Col, Alert } from 'reactstrap';
import _ from 'lodash';
import Progress from './progress';
import Doughnut from './doughnut';
import { Bank } from '../../bank';
import FireAmount from '../../components/FireAmount';


interface IProps {
  month: string, 
  year: string, 
  bank: Bank,
  callback: (index: string, indexes: string[], amount: any, updatedState: boolean) => void
}

interface IState {}

export default class Charts extends React.Component<IProps, IState> {

  clean_pct(pct: number) {
    return Math.min(100, Math.max(0, 100 + 100 * pct));
  }

  render() {
    const { month, year, bank, callback } = this.props;
    
    return (
      <React.Fragment>
        <Col>
          <Alert color="light">
            <Row>
              <Col>
                <span className="label-fake-input">Net worth</span>
              </Col>
              <Col>
                <FireAmount amount={_.get(bank, ['networth', year, month], 0)} 
                            extraClassName="label-fake-input pull-right"
                            display-if-zero={true}
                            display-decimals={bank.showDecimals}
                            callback-props={['networth', year, month]} 
                            callback={callback} />
              </Col>
            </Row>
          </Alert>
          <Alert color="light">
            <Progress label="Month"
                      result={bank.goalMonth[year][month]}
                      goal={bank.monthlyGoal[year]} 
                      percentage={this.clean_pct(bank.goalMonth[year][month] / bank.monthlyGoal[year])} />
            <Progress label="Year"
                      result={bank.goalYearToDate[year][month]} 
                      goal={parseInt(month) * bank.monthlyGoal[year]} 
                      percentage={this.clean_pct(bank.goalYearToDate[year][month] / bank.monthlyGoal[year] / parseInt(month)) } />
            <Row>
              <Col className="col-6 chart-container">
                <Doughnut savingRate={bank.savingRateMonth[year][month]} />
              </Col>
              <Col className="col-6 chart-container">
                <Doughnut savingRate={bank.savingRateYear[year][month]} />
              </Col>
            </Row>
            <Row className="text-center">
              <Col>Month</Col>
              <Col>Year</Col>
            </Row>
          </Alert>
        </Col>
      </React.Fragment>
    );
  }
}
