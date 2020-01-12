import React, { Dispatch } from 'react';
import { connect } from 'react-redux';
import { Alert, Col, Row } from 'reactstrap';

import { updateValue } from '../../actions';
import Bank from '../../bank';
import FireAmount from '../../components/fireAmount';
import { AppState } from '../../store';

interface IProps {
  bank: Bank.IBank;
  bankLoaded: boolean;
  onUpdateValue: (index: string, indexes: string[], amount: number|boolean) => void;
};


const YearlyGoals = (props: IProps) => {
  const { bank, bankLoaded } = props;
  const currentYear = new Date().getFullYear();

  if (!bankLoaded) return null;

  return (
    <Alert color="background">
      <Row>
        <Col>
          <h3>Yearly Goals</h3>
        </Col>
      </Row>
      <Row>
        <Col>
          <table className="table table-borderless table-sm table-equal-width">
            <thead>
              <tr>
                {[...Array(currentYear - bank.headers.firstYear + 2)].map((_,i) => i + bank.headers.firstYear).map(v => (
                  <th key={v}>
                    {v}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              <tr>
                {[...Array(currentYear - bank.headers.firstYear + 2)].map((_,i) => i + bank.headers.firstYear).map(year => (
                  <td key={year}>
                    <FireAmount extraClassName="bold" callback-props={['savingsYearHeaders', 'goals', year]} />
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
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
)(YearlyGoals);