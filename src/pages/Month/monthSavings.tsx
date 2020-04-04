import _ from 'lodash';
import React from 'react';
import { connect } from 'react-redux';

import Bank, { ISavingsHeaderLight } from '../../bank';
import * as formatters from '../../bank/formatters';
import { FireAmount, Text } from '../../components';
import { shouldDisplay } from '../../helpers';
import { AppState } from '../../store';

interface IProps {
  bank: Bank.IBank;
  header: ISavingsHeaderLight;
  month: string;
  year: string;
}

const MonthSavings = ({ header, bank, month, year }: IProps) => {
  const h = _(bank.savingsHeaders)
    .keyBy('id')
    .get([header.id]);

  if (!shouldDisplay(h, parseInt(month), parseInt(year))) {
    return null;
  }

  let label = h.label || 'N/A';
  if (h.sublabel) {
    label += ' > ' + h.sublabel;
  }
  if (h.interest) {
    label += ' > ' + formatters.labelSavings(header.type);
  }

  return (
    <>
      <div className="month-amount">
        <Text className="label-fake-input smaller mb-1">{label}</Text>
        <div className="pull-right">
          <FireAmount
            extraClassName="label-fake-input"
            display-if-zero={true}
            callback-props={['savings', year, month, header.id, header.type]}
          />
        </div>
      </div>
    </>
  );
};

const mapStateToProps = (state: AppState) => {
  return {
    bank: state.bankState.bank
  };
};

export default connect(mapStateToProps)(MonthSavings);
