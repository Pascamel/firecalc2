import React from 'react';
import { connect } from 'react-redux';
import { Alert, Col, Row } from 'reactstrap';

import Bank from '../../bank';
import { AppState } from '../../store';
import Doughnut from './doughnut';

interface IProps {
  month: string;
  year: string;
  bank: Bank.IBank;
}

const HeaderCharts = ({ bank, month, year }: IProps) => {
  return (
    <Alert color="background" style={{ paddingTop: 0 }}>
      <Row>
        <Col className="col-6 month-chart-container">
          <Doughnut
            savingRate={bank.savingRateMonth[year][month]}
            label="Month"
          />
        </Col>
        <Col className="col-6 month-chart-container">
          <Doughnut
            savingRate={bank.savingRateYear[year][month]}
            label="Year"
          />
        </Col>
      </Row>
      {/* <Row className="text-center">
        <Col>Month</Col>
        <Col>Year</Col>
      </Row> */}
    </Alert>
  );
};

const mapStateToProps = (state: AppState) => {
  return {
    bank: state.bankState.bank,
  };
};

export default connect(mapStateToProps)(HeaderCharts);
