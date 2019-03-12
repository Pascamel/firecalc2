import React from 'react';
import Income from './income';
import { Bank } from '../../bank';
import { Row, Col, Button } from 'reactstrap';


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

export default class Incomes extends React.Component<IProps, {}> {
  newHeader = () => {
    this.props.addHeaderCallback('incomes');
  }

  render() {
    const { bank } = this.props;

    return (
      <React.Fragment>
        <Row>
          <Col className="mt-4">
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
      </React.Fragment>
    );
  }
}
