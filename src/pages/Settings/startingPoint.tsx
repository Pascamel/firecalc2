import _ from 'lodash';
import React, { Dispatch } from 'react';
import { connect } from 'react-redux';
import { Alert, Col, CustomInput, Form, Input, Row } from 'reactstrap';

import { updateValue } from '../../actions';
import Bank from '../../bank';
import helpers from '../../helpers';
import { AppState } from '../../store';

interface IProps {
  bank: Bank.IBank;
  bankLoaded: boolean;
  onUpdateValue: (index: string, indexes: string[], amount: number|boolean) => void;
}

function StartingPoint(props: IProps) {
  const { bank, bankLoaded, onUpdateValue } = props;
  const currentYear = new Date().getFullYear();

  const onValueChange = (type: string, value: number) => {
    onUpdateValue('headers', [type], value);
  }

  if (!bankLoaded) return null;

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
              onChange={(e) => onValueChange('startingCapital', parseFloat(e.target.value) || 0)}
              className="col-xs-12 col-sm-1 ml-0 ml-sm-2 mr-0 mr-sm-2"
            />
            <label className="d-none d-sm-inline-block">First month</label>
            <CustomInput
              type="select"
              id="firstMonth"
              value={bank.headers.firstMonth}
              onChange={(e) => onValueChange('firstMonth', parseInt(e.target.value) || 0)} 
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
              onChange={(e) => onValueChange('firstYear', parseInt(e.target.value) || 0)}
              className="mt-2 mt-sm-0"
            >
              {_.range(currentYear - 10, currentYear + 1).map((y, key) => (
                <option value={y} key={key}>{y}</option>
              ))}
            </CustomInput>
          </Form>
        </Col>
      </Row>
    </Alert>
  );
}

const mapStateToProps = (state: AppState) => {
  return ({
    bank: state.bankState.bank,
    bankLoaded: state.bankState.bankLoaded
  });
}

const mapDispatchToProps = (dispatch: Dispatch<any>) => {
  return {
    onUpdateValue: (index: string, indexes: string[], amount: number|boolean) => {
      dispatch(updateValue(index, indexes, amount));
    }
  };
}
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(StartingPoint);
