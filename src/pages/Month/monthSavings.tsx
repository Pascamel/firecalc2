import _ from 'lodash';
import React from 'react';
import { connect } from 'react-redux';

import * as Bank from '../../bank';
import { ISavingsHeader } from '../../bank/interfaces';
import * as formatters from '../../bank/formatters';
import { FireAmount } from '../../components';
import { AppState } from '../../store';

interface IProps {
  bank: Bank.IBank;
  header: ISavingsHeader;
  month: string;
  year: string;
}

interface IState {
  label: string
}

class MonthSavings extends React.Component<IProps, IState> {
  constructor (props: IProps) {
    super(props);

    const h = _(props.bank.savingsHeaders).keyBy('id').get([props.header.id], 'N/A');

    let header_label = h.label || 'N/A';
    if (h.sublabel) header_label += ' > ' + h.sublabel;
    if (h.interest) header_label += ' > ' + formatters.labelSavings(props.header.type);

    this.state = {
      label: header_label
    }
  }

  render() {
    const { header, month, year } = this.props;

    return (
      <React.Fragment>
        <div className="month-amount">
          <span className="label-fake-input smaller mb-1">{this.state.label}</span>
          <div className="pull-right">
            <FireAmount extraClassName="label-fake-input" display-if-zero={true} callback-props={['savings', year, month, header.id, header.type]} />
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

export default connect(mapStateToProps)(MonthSavings);
