import _ from 'lodash';
import React from 'react';
import { connect } from 'react-redux';

import * as Bank from '../../bank';
import { FireAmount } from '../../components';
import { AppState } from '../../store';

interface IProps {
  bank: Bank.IBank;
  header: any;
  month: string;
  year: string;
}

interface IState {
  label: string
}

class MonthIncome extends React.Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);

    this.state = {
      label: _(props.bank.incomeHeaders).keyBy('id').get([props.header.id, 'label'], 'N/A')
    };
  }
  
  render() {
    const { header, month, year } = this.props;

    return (
      <React.Fragment>
        <div className="month-amount">
          <span className="label-fake-input smaller mb-1">{this.state.label}</span>
          <div className="pull-right">
            <FireAmount extraClassName="label-fake-input" display-if-zero={true} callback-props={['income', year, month, header.id]} />
          </div>
        </div>
      </React.Fragment>
    );
  }
}

const mapStateToProps = (state: AppState) => {
  return ({
    bank: state.bankState.bank
  });
}

export default connect(mapStateToProps)(MonthIncome);
