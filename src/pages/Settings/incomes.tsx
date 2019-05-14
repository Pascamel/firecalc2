import React from 'react';
import { Alert, Row, Col, Button } from 'reactstrap';
import Income from './income';
import * as Bank from '../../bank';


interface IProps {
  bank: Bank.IBank,
  addHeaderCallback: (type: string) => void;
  editHeaderCallback: (type: string, header: any) => void;
  confirmEditHeaderCallback: (type: string, header: any) => void;
  cancelEditHeaderCallback: (type: string, header: any) => void;
  deleteHeaderCallback: (type: string, header: any) => void;
  moveUpHeaderCallback: (type: string, index: number) => void;
  moveDownHeaderCallback: (type: string, index: number) => void;
}

export default class Incomes extends React.Component<IProps, {}> {
  newHeader = () => {
    this.props.addHeaderCallback('incomes');
  }

  render() {
    const { bank } = this.props;

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
          <Income key={key} header={header} index={key} {...this.props} />
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
