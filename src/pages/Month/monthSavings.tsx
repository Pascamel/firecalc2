import _ from 'lodash';
import React from 'react';
import { connect } from 'react-redux';

import Bank, { ISavingsHeaderLight } from '../../bank';
import * as formatters from '../../bank/formatters';
import { FireAmount } from '../../components';
import { AppState } from '../../store';

interface IProps {
  bank: Bank.IBank;
  header: ISavingsHeaderLight;
  month: string;
  year: string;
}

const MonthSavings = (props: IProps) => {
  const { header, bank, month, year } = props;
  const h = _(bank.savingsHeaders).keyBy('id').get([props.header.id]);

  let label = h.label || 'N/A';
  if (h.sublabel) label += ' > ' + h.sublabel;
  if (h.interest) label += ' > ' + formatters.labelSavings(props.header.type);

  return (
    <React.Fragment>
      <div className="month-amount">
        <span className="label-fake-input smaller mb-1">{label}</span>
        <div className="pull-right">
          <FireAmount extraClassName="label-fake-input" display-if-zero={true} callback-props={['savings', year, month, header.id, header.type]} />
        </div>
      </div>
    </React.Fragment>
  );
}

const mapStateToProps = (state: AppState) => {
  return ({
    bank: state.bankState.bank
  });
}

export default connect(mapStateToProps)(MonthSavings);
