import React from 'react';
import { connect } from 'react-redux';
import { Alert, Row, Col, Button } from 'reactstrap';
import Saving from './saving';
import * as Bank from '../../bank';


interface IProps {
  bank: Bank.IBank,
  bankLoaded: boolean,
  addHeaderCallback: (type: string) => void;
  editHeaderCallback: (type: string, header: any) => void;
  confirmEditHeaderCallback: (type: string, header: any) => void;
  cancelEditHeaderCallback: (type: string, header: any) => void;
  deleteHeaderCallback: (type: string, header: any) => void;
  moveUpHeaderCallback: (type: string, index: number) => void;
  moveDownHeaderCallback: (type: string, index: number) => void;
}

class Savings extends React.Component<IProps, {}> {
  newHeader = () => {
    this.props.addHeaderCallback('savings');
  }

  render() {
    console.log('render savings');
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

export default connect(mapStateToProps)(Savings);
