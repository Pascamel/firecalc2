import React from 'react';
import { Alert, Row, Col, Input } from 'reactstrap';
import _ from 'lodash';
import helpers from '../../helpers';
import * as Bank from '../../bank';
import Form from 'reactstrap/lib/Form';
import CustomInput from 'reactstrap/lib/CustomInput';


interface IProps {
  headers: any,
  bank: Bank.IBank,
  updateCallback: (indexes: string[], value: number) => void
}

export default class StartingPoint extends React.Component<IProps, {}> {
  currentYear: number;

  constructor(props: IProps) {
    super(props);

    this.currentYear = new Date().getFullYear();
  }

  onValueChange = (type: string, value: number) => {
    this.setState({inputStartingCapital: value})
    this.props.updateCallback(['headers', type], value);
  }

  render() {
    const {headers, bank} = this.props;

    return (
      <Alert color="background">
        <Row>
          <Col>
            <h3>Starting point</h3>
          </Col>
        </Row>
        <Row>
          <Col>
            <Form inline={true}>
              <label className="d-none d-sm-inline-block">Starting Capital</label>
              <Input
                type="text"
                value={bank.headers.startingCapital} 
                onChange={(e) => this.onValueChange('startingCapital', parseFloat(e.target.value) || 0)}
                className="col-xs-12 col-sm-1 ml-0 ml-sm-2 mr-0 mr-sm-2"
              />
              <label className="d-none d-sm-inline-block">First month</label>
              <CustomInput
                type="select"
                id="firstMonth"
                value={bank.headers.firstMonth}
                onChange={(e) => this.onValueChange('firstMonth', parseInt(e.target.value) || 0)} 
                className="ml-0 ml-sm-2 mr-0 mr-sm-2 mt-2 mt-sm-0"
              >
                {_.range(1, 13).map((m, key) => (
                  <option value={m} key={key}>{helpers.labelMonth(m.toString())}</option>
                ))}
              </CustomInput>
              <CustomInput
                type="select"
                id="firstYear"
                value={bank.headers.firstYear}
                onChange={(e) => this.onValueChange('firstYear', parseInt(e.target.value) || 0)}
                className="mt-2 mt-sm-0"
              >
                {_.range(this.currentYear - 10, this.currentYear + 1).map((y, key) => (
                  <option value={y} key={key}>{y}</option>
                ))}
              </CustomInput>
            </Form>
          </Col>
        </Row>
      </Alert>
    );
  }
}
