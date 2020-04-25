import _ from 'lodash';
import React from 'react';
import { connect } from 'react-redux';
import { Alert, Col, CustomInput, Form, Input, Label, Row } from 'reactstrap';
import { AnyAction } from 'redux';
import { ThunkDispatch } from 'redux-thunk';

import { updateValue } from '../../actions';
import Bank from '../../bank';
import { PanelTitle } from '../../components';
import { currentYear, labelMonth } from '../../helpers';
import { AppState } from '../../store';

interface IProps {
  bank: Bank.IBank;
  bankLoaded: boolean;
  onUpdateValue: (
    index: string,
    indexes: string[],
    previous: number | boolean,
    amount: number | boolean
  ) => void;
}

const StartingPoint = ({ bank, bankLoaded, onUpdateValue }: IProps) => {
  const curYear = currentYear();

  const onValueChange = (type: string, previous: number, value: number) => {
    onUpdateValue('headers', [type], previous, value);
  };

  if (!bankLoaded) {
    return null;
  }

  return (
    <Alert color="background">
      <Row>
        <Col>
          <PanelTitle title="Starting point" />
        </Col>
      </Row>
      <Row>
        <Col>
          <Form inline={true}>
            <Label className="d-none d-sm-inline-block">Starting Capital</Label>
            <Input
              type="text"
              value={bank.headers.startingCapital}
              onChange={(e) =>
                onValueChange(
                  'startingCapital',
                  bank.headers.startingCapital,
                  parseFloat(e.target.value) || 0
                )
              }
              className="col-xs-12 col-sm-1 ml-0 ml-sm-2 mr-0 mr-sm-2"
            />
            <Label className="d-none d-sm-inline-block">First month</Label>
            <CustomInput
              type="select"
              id="firstMonth"
              value={bank.headers.firstMonth}
              onChange={(e) =>
                onValueChange(
                  'firstMonth',
                  bank.headers.firstMonth,
                  parseInt(e.target.value) || 0
                )
              }
              className="ml-0 ml-sm-2 mr-0 mr-sm-2 mt-2 mt-sm-0"
            >
              {_.range(1, 13).map((m, key) => (
                <option value={m} key={key}>
                  {labelMonth(m.toString())}
                </option>
              ))}
            </CustomInput>
            <CustomInput
              type="select"
              id="firstYear"
              value={bank.headers.firstYear}
              onChange={(e) =>
                onValueChange(
                  'firstYear',
                  bank.headers.firstYear,
                  parseInt(e.target.value) || 0
                )
              }
              className="mt-2 mt-sm-0"
            >
              {_.range(curYear - 10, curYear + 1).map((y, key) => (
                <option value={y} key={key}>
                  {y}
                </option>
              ))}
            </CustomInput>
          </Form>
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
    onUpdateValue: (
      index: string,
      indexes: string[],
      previous: number | boolean,
      amount: number | boolean
    ) => {
      dispatch(updateValue(index, indexes, previous, amount));
    },
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(StartingPoint);
