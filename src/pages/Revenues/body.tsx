import React, { Component } from 'react';
import _ from 'lodash';
import FireAmount from '../../components/FireAmount';
import helpers from '../../helpers';
import { Bank } from '../../bank';
import { Tracing } from 'trace_events';
import { StaticAmount, StaticPercentage } from '../../components/staticAmount';

interface IProps {
  year: string,
  bank: Bank,
  callback: (index: string, indexes: string[], amount: any, updatedState: boolean) => void
}

interface IState {
  collapsed: boolean;
}

class RevenuesTableBody extends Component<IProps, IState> {
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
          <td className="td-chevron">
            <i className={"fa " + (this.state.collapsed ? 'fa-chevron-right' : 'fa-chevron-down')} onClick={this.handleClickToggle}></i>
          </td>
          <td className={helpers.hideIf(this.state.collapsed)} colSpan={bank.incomeHeaders.length + 3}>
            <span className="pull-left" style={{paddingLeft: '10px'}}>
              { year }
            </span>
          </td>
          {bank.incomeHeaders.map((header: any) => (
          <td key={header.id} className={helpers.showIf(this.state.collapsed)}>
            <StaticAmount bank={bank} display-zero>
              { bank.yearlyIncome[year][header.id] }
            </StaticAmount>
          </td>
          ))}
          <td className={helpers.showIf(this.state.collapsed)}>
            <StaticAmount bank={bank} display-zero>
              { bank.totalYearPost[year] }
            </StaticAmount>
          </td>
          <td className={helpers.showIf(this.state.collapsed)}>
            <StaticAmount bank={bank} display-zero>
              { bank.totalYearPre[year] }
            </StaticAmount>
          </td>
          <td className={`${helpers.showIf(this.state.collapsed)} ${helpers.goal(bank.savingRateYear[year]['12'], 0.5)}`}>
            <StaticPercentage>
              { bank.savingRateYear[year]['12'] }
            </StaticPercentage>
          </td> 
        </tr> 

        {Object.entries(bank.income[year]).map((month) => (
        <tr className={helpers.hideIf(this.state.collapsed)} key={month[0]}>
          <td>{ month[0] }</td>
          {bank.incomeHeaders.map((header: any) => (
          <td key={year + '-' + month[0] + '-' + header.id}>
            <FireAmount amount={month[1][header.id]}
                        display-decimals={bank.showDecimals}
                        callback-props={['income', year, month[0], 'income', header.id]} 
                        callback={callback} />
          </td>
          ))}
          <td className={helpers.showIf(bank.totalMonthIncome[year][month[0]] === 0)} colSpan={3}></td>
          <td className={helpers.hideIf(bank.totalMonthIncome[year][month[0]] === 0)}>
            <StaticAmount bank={bank}>
              { bank.totalMonthPost[year][month[0]] }
            </StaticAmount>
          </td>
          <td className={helpers.hideIf(bank.totalMonthIncome[year][month[0]] === 0)}>
            <StaticAmount bank={bank}>
              { bank.totalMonthPre[year][month[0]] }
            </StaticAmount>
          </td>
          <td className={`${helpers.hideIf(bank.totalMonthIncome[year][month[0]] === 0)} ${helpers.goal(bank.savingRateMonth[year][month[0]], 0.5)}`}>
            <StaticPercentage>
              { bank.savingRateMonth[year][month[0]] }
            </StaticPercentage>
          </td> 
        </tr>
        ))}

        <tr className={helpers.hideIf(this.state.collapsed)}>
          <td><i className="fa fa-calendar-plus-o"></i></td>
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
          <td className={helpers.goal(bank.savingRateYear[year]['12'], 0.5)}>
            <StaticPercentage>
              { bank.savingRateYear[year]['12'] }
            </StaticPercentage>
          </td>
        </tr>
      </tbody>
    );
  }
};

export default RevenuesTableBody;