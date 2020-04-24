import _ from 'lodash';
import React from 'react';
import { connect } from 'react-redux';
import { Alert, Col } from 'reactstrap';

import Bank from '../../bank';
import { PanelTitle } from '../../components';
import { amount } from '../../helpers';
import { AppState } from '../../store';
import Saving from './saving';

interface IProps {
  bank: Bank.IBank;
  month: string;
  year: string;
}

const MonthFinances = ({ month, year, bank }: IProps) => {
  return (
    <Col md={4} sm={12}>
      <Alert color="background">
        <PanelTitle
          title="Savings"
          subTitle={`$${amount(
            _.get(bank.totalMonthSavings, [year, month], 0),
            true,
            bank.showDecimals
          )}`}
        />
        {bank.savingsInputs
          .filter((header) => header.type !== 'T')
          .map((header, key) => (
            <Saving key={key} header={header} month={month} year={year} />
          ))}
      </Alert>
    </Col>
  );
};

const mapStateToProps = (state: AppState) => {
  return {
    bank: state.bankState.bank,
  };
};

export default connect(mapStateToProps)(MonthFinances);
