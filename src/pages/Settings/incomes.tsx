import React, { Dispatch } from 'react';
import { connect } from 'react-redux';
import { Alert, Button, Col, Row } from 'reactstrap';

import { newIncomeHeader } from '../../actions';
import { AppState } from '../../store';
import * as Bank from '../../bank';
import Income from './income';


interface IProps {
  bank: Bank.IBank;
  bankLoaded: boolean;
  onNewIncomeHeader: () => void;
}

class Incomes extends React.Component<IProps, {}> {
  newHeader = () => {
    this.props.onNewIncomeHeader();
  }

  render() {
    const { bank, bankLoaded } = this.props;

    if (!bankLoaded) return null;

    return (
      <Alert color="background">
        <Row>
          <Col>
            <h3>Income</h3>
          </Col>
        </Row>
        {!bank.headers.incomes.length && <Row>
          <Col>
            No headers
          </Col>
        </Row>}
        {bank.headers.incomes.map((header: any, key: number) => (
          <Income key={key} header={header} index={key} />
        ))}
        <Row>
          <Col>
            <Button block color="light" onClick={this.newHeader}>Add new</Button>
          </Col>
        </Row>
      </Alert>
    );
  }
}

const mapStateToProps = (state: AppState) => {
  return ({
    bank: state.bankState.bank,
    bankLoaded: state.bankState.bankLoaded
  });
}

const mapDispatchToProps = (dispatch: Dispatch<any>) => {
  return {
    onNewIncomeHeader: () => {
      dispatch(newIncomeHeader());
    },
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Incomes);
