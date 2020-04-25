import React from 'react';
import { connect } from 'react-redux';
import { Alert, Button, Col, Row } from 'reactstrap';
import { AnyAction } from 'redux';
import { ThunkDispatch } from 'redux-thunk';

import { newSavingHeader } from '../../actions';
import Bank, { ISavingsHeader } from '../../bank';
import { PanelTitle } from '../../components';
import { AppState } from '../../store';
import Saving from './saving';

interface IProps {
  bank: Bank.IBank;
  bankLoaded: boolean;
  onNewSavingHeader: () => void;
}

const Savings = ({ bank, bankLoaded, onNewSavingHeader }: IProps) => {
  if (!bankLoaded) {
    return null;
  }

  return (
    <Alert color="background">
      <Row>
        <Col>
          <PanelTitle title="Savings" />
        </Col>
      </Row>
      {!bank.headers.savings.length && (
        <Row>
          <Col>No headers</Col>
        </Row>
      )}
      {bank.headers.savings.map((header: ISavingsHeader, key: number) => (
        <Saving key={key} header={header} index={key} />
      ))}
      <Row className="form-headers">
        <Col>
          <Button
            block
            color="light"
            onClick={onNewSavingHeader}
            className="mt-2"
          >
            Add New
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

const mapDispatchToProps = (
  dispatch: ThunkDispatch<AppState, void, AnyAction>
) => {
  return {
    onNewSavingHeader: () => {
      dispatch(newSavingHeader());
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Savings);
