import React from 'react';
import { connect } from 'react-redux';
import { Alert, Col } from 'reactstrap';

import Bank from '../../bank';
import { PanelTitle } from '../../components';
import { AppState } from '../../store';

interface IProps {
  bank: Bank.IBank;
  month: string;
  year: string;
}

const Expenses = ({ month, year, bank }: IProps) => {
  return (
    <Col md={4} sm={12}>
      <Alert color="background">
        <PanelTitle title="Expenses" subTitle="TODO" />
      </Alert>
    </Col>
  );
};

const mapStateToProps = (state: AppState) => {
  return {
    bank: state.bankState.bank,
  };
};

export default connect(mapStateToProps)(Expenses);
