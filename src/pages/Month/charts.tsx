import React from 'react';
import { Row, Col, Alert } from 'reactstrap';
import Progress from './progress';
import Doughnut from './doughnut';
import { Bank } from '../../bank';


interface IProps {
  month: string, 
  year: string, 
  bank: Bank
}

interface IState {}

export default class Charts extends React.Component<IProps, IState> {

  clean_pct(pct: number) {
    return Math.min(100, Math.max(0, 100 + 100 * pct));
  }

  render() {
    const { month, year, bank } = this.props;
    
    return (
      <React.Fragment>
        <Col>
          <Alert color="secondary">
            <Progress label="Month"
                      result={bank.goalMonth[year][month]}
                      goal={bank.monthlyGoal[year]} 
                      percentage={this.clean_pct(bank.goalMonth[year][month] / bank.monthlyGoal[year])} />
            <Progress label="Year"
                      result={bank.goalYearToDate[year][month]} 
                      goal={parseInt(month) * bank.monthlyGoal[year]} 
                      percentage={this.clean_pct(bank.goalYearToDate[year][month] / bank.monthlyGoal[year] / parseInt(month)) } />
            <Row>
              <Doughnut savingRate={bank.savingRateMonth[year][month]} />
              <Doughnut savingRate={bank.savingRateYear[year][month]} />
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
