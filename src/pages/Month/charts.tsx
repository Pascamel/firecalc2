import _ from 'lodash';
import React, { Dispatch } from 'react';
import { connect } from 'react-redux';
import { Alert, Col, Row } from 'reactstrap';

import Bank from '../../bank';
import { FireAmount, StaticAmount } from '../../components';
import { AppState } from '../../store';
import Doughnut from './doughnut';
import Progress from './progress';

interface IProps {
  month: string; 
  year: string;
  bank: Bank.IBank;
  bankUpdated: boolean;
}

class Charts extends React.Component<IProps, {}> {
  clean_pct(pct: number) {
    return Math.min(100, Math.max(0, 100 + 100 * pct));
  }

  render() {    
    const { month, year, bank } = this.props;
    
    return (
      <React.Fragment>
        <Col md={4} sm={12}>
          <Alert color="background">
            <Row>
              <Col>
                <span className="label-fake-input">Net worth</span>
              </Col>
              <Col>
                <FireAmount extraClassName="label-fake-input pull-right" display-if-zero={true} callback-props={['networth', year, month]} />
              </Col>
            </Row>
          </Alert>
          <Alert color="background">
            <Progress label="Month"
                      result={bank.goalMonth[year][month]}
                      goal={bank.monthlyGoal[year]} 
                      percentage={this.clean_pct(bank.goalMonth[year][month] / bank.monthlyGoal[year])} />
            <Progress label="Year"
                      result={bank.goalYearToDate[year][month]} 
                      goal={parseInt(month) * bank.monthlyGoal[year]} 
                      percentage={this.clean_pct(bank.goalYearToDate[year][month] / bank.monthlyGoal[year] / parseInt(month)) } />
            <hr />
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
            <hr />
            <Row>
              <Col>
                Estimated expenses
                <span className="pull-right text-secondary">
                  $
                  <StaticAmount display-zero>
                    {_.get(bank.totalMonthIncome, [year, month], 0) - _.get(bank.totalMonthSavings, [year, month], 0)}
                  </StaticAmount>
                </span>
              </Col>
            </Row>
          </Alert>
        </Col>
      </React.Fragment>
    );
  }
}

const mapStateToProps = (state: AppState) => {
  return ({
    bank: state.bankState.bank,
    bankUpdated: state.bankState.bankUpdated
  });
}

export default connect(mapStateToProps)(Charts);
