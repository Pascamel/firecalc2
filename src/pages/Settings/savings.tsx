import React from 'react';
import { Row, Col, Button } from 'reactstrap';
import Saving from './saving';
import { Bank } from '../../bank';

interface IProps {
  bank: Bank,
  addHeaderCallback: (type: string) => void;

  editHeaderCallback: (type: string, header: any) => void;
  confirmEditHeaderCallback: (type: string, header: any) => void;
  cancelEditHeaderCallback: (type: string, header: any) => void;
  deleteHeaderCallback: (type: string, header: any) => void;
  moveUpHeaderCallback: (type: string, index: number) => void;
  moveDownHeaderCallback: (type: string, index: number) => void;
}

export default class Savings extends React.Component<IProps, {}> {
  newHeader = () => {
    this.props.addHeaderCallback('savings');
  }

  render() {
    const {bank} = this.props;

    return (
      <React.Fragment>
        <Row>
          <Col className="mt-4">
            <h3>Savings</h3>
          </Col>
        </Row>
        {!bank.headers.savings.length && <Row>
          <Col>
            No headers
          </Col>
        </Row>}
        {bank.headers.savings.map((header: any, key: number) => (
          <Saving key={key} header={header} index={key} {...this.props} />
        ))}
        <Row>
          <Col>
            <Button block color="light" onClick={this.newHeader}>
              Add New
            </Button>
          </Col>
        </Row>
      </React.Fragment>
    );
  }
}
