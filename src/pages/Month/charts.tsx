import _ from 'lodash';
import React from 'react';
import { connect } from 'react-redux';
import { Alert, Col, Row } from 'reactstrap';

import Bank from '../../bank';
import { FireAmount, Text } from '../../components';
import helpers from '../../helpers';
import { AppState } from '../../store';
import Doughnut from './doughnut';
import Progress from './progress';

interface IProps {
  month: string;
  year: string;
  bank: Bank.IBank;
}

const Charts = (props: IProps) => {
  const { month, year, bank } = props;
  const estimatedExpenses =
    _.get(bank.totalMonthIncome, [year, month], 0) -
    _.get(bank.totalMonthSavings, [year, month], 0);

  return (
    <>
      <Col md={4} sm={12}>
        <Alert color="background">
          <Row>
            <Col>
              <Text className="label-fake-input">Net Worth</Text>
            </Col>
            <Col>
              <FireAmount
                extraClassName="label-fake-input pull-right"
                display-if-zero={true}
                callback-props={['networth', year, month]}
              />
            </Col>
          </Row>
          <Row>
            <Col>
              <Text className="label-fake-input">Expenses</Text>
            </Col>
            <Col>
              <FireAmount
                extraClassName="label-fake-input pull-right"
                display-if-zero={true}
                callback-props={['expenses', year, month]}
              />
            </Col>
          </Row>
        </Alert>
        <Alert color="background">
          <Progress
            label="Month"
            result={bank.goalMonth[year][month]}
            goal={bank.monthlyGoal[year]}
            percentage={helpers.clean_percentage(
              bank.goalMonth[year][month] / bank.monthlyGoal[year]
            )}
          />
          <Progress
            label="Year"
            result={bank.goalYearToDate[year][month]}
            goal={parseInt(month) * bank.monthlyGoal[year]}
            percentage={helpers.clean_percentage(
              bank.goalYearToDate[year][month] /
                bank.monthlyGoal[year] /
                parseInt(month)
            )}
          />
          <hr />
          <Row>
            <Col className="col-6 month-chart-container">
              <Doughnut savingRate={bank.savingRateMonth[year][month]} />
            </Col>
            <Col className="col-6 month-chart-container">
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
              <Text>Estimated expenses</Text>
              <Text className="pull-right text-secondary">
                {`$${helpers.amount(
                  estimatedExpenses,
                  true,
                  bank.showDecimals
                )}`}
              </Text>
            </Col>
          </Row>
        </Alert>
      </Col>
    </>
  );
};

const mapStateToProps = (state: AppState) => {
  return {
    bank: state.bankState.bank
  };
};

export default connect(mapStateToProps)(Charts);
