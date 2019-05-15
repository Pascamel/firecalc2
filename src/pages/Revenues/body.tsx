import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import _ from 'lodash';
import React from 'react';

import * as Bank from '../../bank';
import { FireAmount, FireTD, FireTR, StaticAmount, StaticPercentage } from '../../components';

interface IProps {
  year: string,
  bank: Bank.IBank,
  callback: (index: string, indexes: string[], amount: any, updatedState: boolean) => void
}

interface IState {
  collapsed: boolean;
}

export default class RevenuesTableBody extends React.Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);

    this.state = {collapsed: _.get(props.bank.incomeYearHeaders, ['collapsed', props.year], false)};
    this.handleClickToggle = this.handleClickToggle.bind(this);
  }

  handleClickToggle() {
    const newValue = !this.state.collapsed;
    this.setState({collapsed: newValue});
    this.props.callback('incomeYearHeaders', ['collapsed', this.props.year], newValue, false);
  }

  render() {
    const {year, bank, callback} = this.props;

    return (
      <tbody>
        <tr>
          <td className="td-chevron" onClick={this.handleClickToggle}>
            <FontAwesomeIcon icon={this.state.collapsed ? 'chevron-right' : 'chevron-down'} />
          </td>
          <FireTD show={!this.state.collapsed} span={bank.incomeHeaders.length + 3}>
            <span className="pull-left pl-2">
              { year }
            </span>
          </FireTD>
          {bank.incomeHeaders.map((header: any) => (
          <FireTD show={this.state.collapsed} key={header.id}>
            <StaticAmount bank={bank} display-zero>
              { bank.yearlyIncome[year][header.id] }
            </StaticAmount>
          </FireTD>
          ))}
          <FireTD show={this.state.collapsed}>
            <StaticAmount bank={bank} display-zero>
              { bank.totalYearPost[year] }
            </StaticAmount>
          </FireTD>
          <FireTD show={this.state.collapsed}>
            <StaticAmount bank={bank} display-zero>
              { bank.totalYearPre[year] }
            </StaticAmount>
          </FireTD>
          <FireTD show={this.state.collapsed} goal={bank.savingRateYear[year]['12']} threshold={0.5}>
            <StaticPercentage>
              { bank.savingRateYear[year]['12'] }
            </StaticPercentage>
          </FireTD>
        </tr> 

        {Object.entries(bank.income[year]).map((month) => (
        <FireTR hide={this.state.collapsed} key={month[0]}>
          <td>{ month[0] }</td>
          {bank.incomeHeaders.map((header: any) => (
          <td key={year + '-' + month[0] + '-' + header.id}>
            <FireAmount amount={month[1][header.id]}
                        display-decimals={bank.showDecimals}
                        callback-props={['income', year, month[0], header.id]} 
                        callback={callback} />
          </td>
          ))}
          {bank.totalMonthIncome[year][month[0]] === 0 && <td colSpan={3}></td>}
          {bank.totalMonthIncome[year][month[0]] !== 0 && <React.Fragment>
            <td>
              <StaticAmount bank={bank}>
                { bank.totalMonthPost[year][month[0]] }
              </StaticAmount>
            </td>
            <td>
              <StaticAmount bank={bank}>
                { bank.totalMonthPre[year][month[0]] }
              </StaticAmount>
            </td>
            <FireTD goal={bank.savingRateMonth[year][month[0]]} threshold={0.5}>
              <StaticPercentage>
                { bank.savingRateMonth[year][month[0]] }
              </StaticPercentage>
            </FireTD>
          </React.Fragment>}
        </FireTR>
        ))}

        <FireTR hide={this.state.collapsed}>
          <td>
            <FontAwesomeIcon icon={['far', 'calendar-alt']} />
          </td>
          {bank.incomeHeaders.map((header: any) => (
          <td key={header.id}>
            <StaticAmount bank={bank} display-zero>
              { bank.yearlyIncome[year][header.id] }
            </StaticAmount>
          </td>
          ))}
          <td>
            <StaticAmount bank={bank} display-zero>
              { bank.totalYearPost[year] }
            </StaticAmount>
          </td>
          <td>
            <StaticAmount bank={bank} display-zero>
              { bank.totalYearPre[year] }
            </StaticAmount>
          </td>
          <FireTD goal={bank.savingRateYear[year]['12']} threshold={0.5}>
            <StaticPercentage>
              { bank.savingRateYear[year]['12'] }
            </StaticPercentage>
          </FireTD>
        </FireTR>
      </tbody>
    );
  }
};
