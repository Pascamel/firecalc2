import _ from 'lodash';
import React, { useState } from 'react';
import { connect } from 'react-redux';
import { AnyAction } from 'redux';
import { ThunkDispatch } from 'redux-thunk';

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
    label: string,
    previous: boolean,
    amount: boolean
  ) => void;
}

const Body = ({ year, bank, onUpdateValueLocalStorage }: IProps) => {
  const [collapsed, setCollapsed] = useState(
    _.get(bank.incomeYearHeaders, ['collapsed', year], false)
  );

  const handleClickToggle = () => {
    onUpdateValueLocalStorage(
      'incomeYearHeaders',
      ['collapsed', year],
      `Collapsed Incomes for year ${year}`,
      collapsed,
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
        <FireTD show={!collapsed} span={bank.incomeHeaders.length + 3}>
          <Text className="pull-left pl-2">{year}</Text>
        </FireTD>
        {bank.incomeHeaders.map((header) => (
          <FireTD show={collapsed} key={header.id}>
            <StaticAmount display-zero>
              {bank.yearlyIncome[year][header.id]}
            </StaticAmount>
          </FireTD>
        ))}
        <FireTD show={collapsed}>
          <StaticAmount display-zero>{bank.totalYearPost[year]}</StaticAmount>
        </FireTD>
        <FireTD show={collapsed}>
          <StaticAmount display-zero>{bank.totalYearPre[year]}</StaticAmount>
        </FireTD>
        <FireTD
          show={collapsed}
          goal={bank.savingRateYear[year]['12']}
          threshold={0.5}
        >
          <StaticPercentage>{bank.savingRateYear[year]['12']}</StaticPercentage>
        </FireTD>
      </tr>

      {Object.entries(bank.income[year]).map((month) => (
        <FireTR hide={collapsed} key={month[0]}>
          <td>{month[0]}</td>
          {bank.incomeHeaders.map((header) => (
            <td key={year + '-' + month[0] + '-' + header.id}>
              <FireAmount
                callback-props={['income', year, month[0], header.id]}
              />
            </td>
          ))}
          {bank.totalMonthIncome[year][month[0]] === 0 && <td colSpan={3}></td>}
          {bank.totalMonthIncome[year][month[0]] !== 0 && (
            <>
              <td>
                <StaticAmount>
                  {bank.totalMonthPost[year][month[0]]}
                </StaticAmount>
              </td>
              <td>
                <StaticAmount>
                  {bank.totalMonthPre[year][month[0]]}
                </StaticAmount>
              </td>
              <FireTD
                goal={bank.savingRateMonth[year][month[0]]}
                threshold={0.5}
              >
                <StaticPercentage>
                  {bank.savingRateMonth[year][month[0]]}
                </StaticPercentage>
              </FireTD>
            </>
          )}
        </FireTR>
      ))}

      <FireTR hide={collapsed}>
        <td>
          <Icon icon={['far', 'calendar-alt']} />
        </td>
        {bank.incomeHeaders.map((header) => (
          <td key={header.id}>
            <StaticAmount display-zero>
              {bank.yearlyIncome[year][header.id]}
            </StaticAmount>
          </td>
        ))}
        <td>
          <StaticAmount display-zero>{bank.totalYearPost[year]}</StaticAmount>
        </td>
        <td>
          <StaticAmount display-zero>{bank.totalYearPre[year]}</StaticAmount>
        </td>
        <FireTD goal={bank.savingRateYear[year]['12']} threshold={0.5}>
          <StaticPercentage>{bank.savingRateYear[year]['12']}</StaticPercentage>
        </FireTD>
      </FireTR>
    </tbody>
  );
};

const mapStateToProps = (state: AppState) => {
  return {
    bank: state.bankState.bank,
  };
};

const mapDispatchToProps = (
  dispatch: ThunkDispatch<AppState, void, AnyAction>
) => {
  return {
    onUpdateValueLocalStorage: (
      index: string,
      indexes: string[],
      label: string,
      previous: boolean,
      amount: boolean
    ) => {
      dispatch(
        updateValueLocalStorage(index, indexes, label, previous, amount)
      );
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Body);
