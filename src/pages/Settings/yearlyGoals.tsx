import React from 'react';
import { connect } from 'react-redux';
import { Alert, Col, Row } from 'reactstrap';

import Bank from '../../bank';
import { FireAmount, PanelTitle, Text } from '../../components';
import { amount } from '../../helpers';
import { AppState } from '../../store';

interface IProps {
  bank: Bank.IBank;
  bankLoaded: boolean;
}

interface IYoyLabel {
  bank: Bank.IBank;
  year: number;
}

const YoyLabel = ({ year, bank }: IYoyLabel) => {
  const currentYear = new Date().getFullYear();
  const defaultLabel = <Text>-</Text>;

  if (year <= bank.headers.firstYear) return defaultLabel;
  if (year > currentYear + 1) return defaultLabel;
  if (!(bank.savingsYearHeaders.goals[year - 1] > 0)) return defaultLabel;
  if (!(bank.savingsYearHeaders.goals[year] > 0)) return defaultLabel;

  const value =
    bank.savingsYearHeaders.goals[year] -
    bank.savingsYearHeaders.goals[year - 1];

  return (
    <span className={value >= 0 ? 'text-success' : 'text-danger'}>
      ${amount(value, false, true)}
    </span>
  );
};

const YearlyGoals = ({ bank, bankLoaded }: IProps) => {
  const currentYear = new Date().getFullYear();

  if (!bankLoaded) {
    return null;
  }

  return (
    <Alert color="background">
      <Row>
        <Col>
          <PanelTitle title="Yearly Goals" />
        </Col>
      </Row>
      <Row>
        <Col sm={4} xs={12}>
          Year
        </Col>
        <Col sm={{ size: 2, offset: 2 }} xs={12}>
          YoY
        </Col>
      </Row>
      {[...Array(currentYear - bank.headers.firstYear + 2)]
        .map((_, i) => i + bank.headers.firstYear)
        .map((year) => (
          <Row key={year}>
            <Col sm={4} xs={8}>
              <span className="label-fake-input smaller mb-1">{year}</span>
              <div className="pull-right">
                <FireAmount
                  extraClassName="label-fake-input"
                  callback-props={[
                    'savingsYearHeaders',
                    'goals',
                    year.toString(),
                  ]}
                />
              </div>
            </Col>
            <Col sm={{ size: 4, offset: 2 }} xs={4}>
              <YoyLabel bank={bank} year={year} />
            </Col>
          </Row>
        ))}
    </Alert>
  );
};

const mapStateToProps = (state: AppState) => {
  return {
    bank: state.bankState.bank,
    bankLoaded: state.bankState.bankLoaded,
  };
};

export default connect(mapStateToProps)(YearlyGoals);
