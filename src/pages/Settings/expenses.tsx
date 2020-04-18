import React, { Dispatch } from 'react';
import { connect } from 'react-redux';
import { Alert, Button, Col, Row } from 'reactstrap';

import { newExpenseHeader } from '../../actions';
import Bank, { IExpenseHeader } from '../../bank';
import { PanelTitle } from '../../components';
import { AppState } from '../../store';
import Expense from './expense';

interface IProps {
  bank: Bank.IBank;
  bankLoaded: boolean;
  onNewExpenseHeader: (isFuture: boolean) => void;
}

const Expenses = ({ bank, bankLoaded, onNewExpenseHeader }: IProps) => {
  if (!bankLoaded) {
    return null;
  }

  return (
    <Alert color="background">
      <Row>
        <Col>
          <PanelTitle title="Monthly Expenses" />
        </Col>
      </Row>
      {bank.headers.expenses.filter((h: IExpenseHeader) => !h.isFuture)
        .length === 0 && (
        <Row>
          <Col>No Monthly headers</Col>
        </Row>
      )}
      {bank.headers.expenses
        .filter((h: IExpenseHeader) => !h.isFuture)
        .map((header: IExpenseHeader, key: number) => (
          <Expense key={key} header={header} index={key} />
        ))}
      <Row className="form-headers mt-2">
        <Col>
          <Button block color="light" onClick={() => onNewExpenseHeader(false)}>
            Add new
          </Button>
        </Col>
      </Row>
      <Row className="mt-5">
        <Col>
          <PanelTitle title="Future Expenses" />
        </Col>
      </Row>
      {bank.headers.expenses.filter((h: IExpenseHeader) => h.isFuture)
        .length === 0 && (
        <Row>
          <Col>No Future headers</Col>
        </Row>
      )}

      {bank.headers.expenses
        .filter((h: IExpenseHeader) => h.isFuture)
        .map((header: IExpenseHeader, key: number) => (
          <Expense key={key} header={header} index={key} />
        ))}
      <Row className="form-headers mt-2">
        <Col>
          <Button block color="light" onClick={() => onNewExpenseHeader(true)}>
            Add new
          </Button>
        </Col>
      </Row>
    </Alert>
  );
};

const mapStateToProps = (state: AppState) => {
  return {
    bank: state.bankState.bank,
    bankLoaded: state.bankState.bankLoaded,
  };
};

const mapDispatchToProps = (dispatch: Dispatch<any>) => {
  return {
    onNewExpenseHeader: (isFuture: boolean) => {
      dispatch(newExpenseHeader(isFuture));
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Expenses);
