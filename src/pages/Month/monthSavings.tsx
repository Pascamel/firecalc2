import _ from 'lodash';
import React from 'react';
import { connect } from 'react-redux';

import Bank, { ISavingsHeaderLight } from '../../bank';
import * as formatters from '../../bank/formatters';
import { FireAmount, Text } from '../../components';
import helpers from '../../helpers';
import { AppState } from '../../store';

interface IProps {
  bank: Bank.IBank;
  header: ISavingsHeaderLight;
  month: string;
  year: string;
}

const MonthSavings = (props: IProps) => {
  const { header, bank, month, year } = props;

  const h = _(bank.savingsHeaders)
    .keyBy('id')
    .get([props.header.id]);

  if (!helpers.shouldDisplay(h, parseInt(month), parseInt(year))) {
    // return null;
    const line1 = `${h.displayFrom ? 'TRUE' : 'FALSE'}-${h.displayFromMonth}-${
      h.displayFromYear
    }`;
    const line2 = `${h.displayTo ? 'TRUE' : 'FALSE'}-${h.displayToMonth}-${
      h.displayToYear
    }`;
    console.log('render case pas bon', line1, line2);
    return (
      <>
        <div>
          <span>
            {h.label} is off because {line1}
          </span>
          <span></span>
        </div>
        <div>
          <span>
            {h.label} is off because {line2}
          </span>
          <span></span>
        </div>
      </>
    );
  }

  let label = h.label || 'N/A';
  if (h.sublabel) label += ' > ' + h.sublabel;
  if (h.interest) label += ' > ' + formatters.labelSavings(props.header.type);

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
