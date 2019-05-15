import _ from 'lodash';
import React from 'react';
import { connect } from 'react-redux';

import * as Bank from '../../bank';
import * as formatters from '../../bank/formatters';
import { FireAmount } from '../../components';

interface IProps {
  bank: Bank.IBank,
  header: any,
  month: string,
  year: string, 
  callback: (index: string, indexes: string[], amount: any, updatedState: boolean) => void
  data: string
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
    const { header, month, year, callback, data, bank } = this.props;

    return (
      <React.Fragment>
        <div className="month-amount">
          <span className="label-fake-input smaller mb-1">{this.state.label}</span>
          <div className="pull-right">
            <FireAmount amount={_.get(data, [header.id, header.type], 0)} 
                        extraClassName="label-fake-input"
                        display-if-zero={true}
                        display-decimals={bank.showDecimals}
                        callback-props={['savings', year, month, header.id, header.type]} 
                        callback={callback} />
          </div>
        </div>
      </React.Fragment>
    );
  }
}

const mapStateToProps = (state: any) => {
  return ({
    bank: state.bankState.bank
  });
}

export default connect(mapStateToProps)(MonthSavings);
