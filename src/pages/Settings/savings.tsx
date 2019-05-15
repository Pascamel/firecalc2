import React, { Dispatch } from 'react';
import { connect } from 'react-redux';
import { Alert, Button, Col, Row } from 'reactstrap';

import { newSavingHeader } from '../../actions';
import * as Bank from '../../bank';
import Saving from './saving';

interface IProps {
  bank: Bank.IBank,
  bankLoaded: boolean,
  onNewSavingHeader: (bank: Bank.IBank) => void,
}

class Savings extends React.Component<IProps, {}> {
  newHeader = () => {
    this.props.onNewSavingHeader(this.props.bank);
  }

  render() {
    const {bank, bankLoaded} = this.props;

    if (!bankLoaded) return null;

    return (
      <Alert color="background">
        <Row>
          <Col>
            <h3>Savings</h3>
          </Col>
        </Row>
        {!bank.headers.savings.length && <Row>
          <Col>
            No headers
          </Col>
        </Row>}
        {bank.headers.savings.map((header: any, key: number) => (
          <Saving key={key} header={header} index={key} />
        ))}
        <Row>
          <Col>
            <Button block color="light" onClick={this.newHeader}>
              Add New
            </Button>
          </Col>
        </Row>
      </Alert>
    );
  }
}

const mapStateToProps = (state: any) => {
  return ({
    bank: state.bankState.bank,
    bankLoaded: state.bankState.bankLoaded
  });
}

const mapDispatchToProps = (dispatch: Dispatch<any>) => {
  return {
    onNewSavingHeader: (bank: Bank.IBank) => {
      dispatch(newSavingHeader(bank));
    },
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Savings);
