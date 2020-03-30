import _ from 'lodash';
import React, { Dispatch, useState } from 'react';
import { connect } from 'react-redux';

import { updateValueLocalStorage } from '../../actions';
import Bank from '../../bank';
import {
    FireAmount, FireTD, FireTR, Icon, StaticAmount, StaticPercentage, Text
} from '../../components';
import { AppState } from '../../store';

interface IProps {
  bank: Bank.IBank;
  year: string;
  onUpdateValueLocalStorage: (
    index: string,
    indexes: string[],
    amount: number | boolean
  ) => void;
}

const Body = (props: IProps) => {
  const { year, bank, onUpdateValueLocalStorage } = props;
  const [collapsed, setCollapsed] = useState(
    _.get(bank.savingsYearHeaders.collapsed, year, false)
  );

  const handleClickToggle = () => {
    onUpdateValueLocalStorage(
      'savingsYearHeaders',
      ['collapsed', year],
      !collapsed
    );
    setCollapsed(!collapsed);
  };

  return (
    <tbody>
      <tr>
        <td className="td-chevron" onClick={handleClickToggle}>
          <Icon icon={collapsed ? 'chevron-right' : 'chevron-down'} />
        </td>
        <FireTD span={bank.savingsInputsHidden.length + 5} hide={collapsed}>
          <>
            <Text className="pull-left ml-2">{year}</Text>
            <span>
              Begins at{' '}
              <b>
                <StaticAmount>{bank.startOfYearAmount[year]}</StaticAmount>
              </b>{' '}
              - Goal is&nbsp;
              <FireAmount
                extraClassName="bold"
                callback-props={['savingsYearHeaders', 'goals', year]}
              />
              &nbsp;(
              <StaticAmount>{bank.monthlyGoal[year]}</StaticAmount>
              /mo)
            </span>
          </>
        </FireTD>
        {bank.savingsInputsHidden.map((amount, idx: number) => (
          <FireTD show={collapsed} key={idx}>
            <StaticAmount display-zero>
              {bank.totalInstitution[year][amount.id][amount.type]}
            </StaticAmount>
          </FireTD>
        ))}
        <FireTD show={collapsed}>
          <Text>Total</Text>
        </FireTD>
        <FireTD show={collapsed}>
          <StaticAmount display-zero>
            {bank.totalHolding[year]['12']}
          </StaticAmount>
        </FireTD>
        <FireTD show={collapsed}>
          <Text>{year}</Text>
        </FireTD>
        <FireTD
          show={collapsed}
          goal={bank.goalYearToDate[year]['12']}
          threshold={0}
        >
          <StaticAmount display-zero>
            {bank.goalYearToDate[year]['12']}
          </StaticAmount>
        </FireTD>
        <FireTD
          show={collapsed}
          goal={bank.savingRateYear[year]['12']}
          threshold={0.5}
        >
          <StaticPercentage>{bank.savingRateYear[year]['12']}</StaticPercentage>
        </FireTD>
      </tr>
      {Object.entries(bank.savings[year]).map((month, idx) => (
        <FireTR hide={collapsed} key={idx}>
          <td>{month[0]}</td>
          {bank.savingsInputsHidden.map((amount, idx: number) => (
            <td key={idx}>
              {amount.type !== 'T' && (
                <FireAmount
                  callback-props={[
                    'savings',
                    year,
                    month[0],
                    amount.id,
                    amount.type
                  ]}
                />
              )}
              {amount.type === 'T' && (
                <StaticAmount>
                  {bank.totalMonthInstitution[year][month[0]][amount.id]}
                </StaticAmount>
              )}
            </td>
          ))}
          <td>
            <StaticAmount>
              {bank.totalMonthSavings[year][month[0]]}
            </StaticAmount>
          </td>
          <FireTD
            show={bank.totalMonthSavings[year][month[0]] === 0}
            span={4}
          />
          <FireTD hide={bank.totalMonthSavings[year][month[0]] === 0}>
            <StaticAmount>{bank.totalHolding[year][month[0]]}</StaticAmount>
          </FireTD>
          <FireTD
            hide={bank.totalMonthSavings[year][month[0]] === 0}
            goal={bank.goalMonth[year][month[0]]}
            threshold={0}
          >
            <StaticAmount>{bank.goalMonth[year][month[0]]}</StaticAmount>
          </FireTD>
          <FireTD
            hide={bank.totalMonthSavings[year][month[0]] === 0}
            goal={bank.goalYearToDate[year][month[0]]}
            threshold={0}
          >
            <StaticAmount display-zero>
              {bank.goalYearToDate[year][month[0]]}
            </StaticAmount>
          </FireTD>
          <FireTD
            hide={bank.totalMonthSavings[year][month[0]] === 0}
            goal={bank.savingRateMonth[year][month[0]]}
            threshold={0.5}
          >
            <StaticPercentage>
              {bank.savingRateMonth[year][month[0]]}
            </StaticPercentage>
          </FireTD>
        </FireTR>
      ))}
      <FireTR hide={collapsed}>
        <td>
          <Icon icon={['far', 'calendar-alt']} />
        </td>
        {bank.savingsInputsHidden.map((amount, idx: number) => (
          <td key={idx}>
            <StaticAmount display-zero>
              {bank.totalInstitution[year][amount.id][amount.type]}
            </StaticAmount>
          </td>
        ))}
        <td>Total</td>
        <td className="table-warning">
          <StaticAmount display-zero>
            {bank.totalHolding[year]['12']}
          </StaticAmount>
        </td>
        <td>Goal</td>
        <FireTD goal={bank.goalYearToDate[year]['12']} threshold={0}>
          <StaticAmount display-zero>
            {bank.goalYearToDate[year]['12']}
          </StaticAmount>
        </FireTD>
        <FireTD goal={bank.savingRateYear[year]['12']} threshold={0.5}>
          <StaticPercentage>{bank.savingRateYear[year]['12']}</StaticPercentage>
        </FireTD>
      </FireTR>
    </tbody>
  );
};

const mapStateToProps = (state: AppState) => {
  return {
    bank: state.bankState.bank
  };
};

const mapDispatchToProps = (dispatch: Dispatch<any>) => {
  return {
    onUpdateValueLocalStorage: (
      index: string,
      indexes: string[],
      amount: number | boolean
    ) => {
      dispatch(updateValueLocalStorage(index, indexes, amount));
    }
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Body);
