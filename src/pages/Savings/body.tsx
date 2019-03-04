import React, { Component } from 'react';
import _ from 'lodash';

import FireAmount from '../../components/FireAmount';
import FireTD from '../../components/fireTD';
import StaticAmount from '../../components/staticAmount';
import { Bank } from '../../bank';
import helpers from '../../helpers';

interface IProps {
  bank: Bank;
  year: string;
  callback: (index: string, indexes: string[], amount: any, updatedState: boolean) => void
}

interface IState {
  collapsed: boolean;
}

export default class Body extends Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);

    this.state = {collapsed: _.get(props.bank.savingsYearHeaders.collapsed, props.year, false)};
    this.handleClickToggle = this.handleClickToggle.bind(this);
  }

  handleClickToggle() {
    const newValue = !this.state.collapsed;
    this.setState({collapsed: newValue});
    this.props.callback('savingsYearHeaders', ['collapsed', this.props.year], newValue, false);
  }

  render() {
    const { year, bank, callback } = this.props;
    
    return (
      <tbody>
        <tr>
          <td className="td-chevron">
            <i className={`fa ${this.state.collapsed ? 'fa-chevron-right' : 'fa-chevron-down'}`} onClick={this.handleClickToggle}></i>
          </td>
          <FireTD span={bank.savingsInputsHidden.length + 5} hide={this.state.collapsed}>
            <span className="pull-left" style={{paddingLeft: '10px'}}>
              { year }
            </span>
            <span>
              Begins at <b>
                <StaticAmount bank={bank}>
                  { bank.startOfYearAmount[year] }
                </StaticAmount>
              </b> - Goal is&nbsp;
              <FireAmount amount={_.get(bank, ['savingsYearHeaders', 'goals', year])}
                          extraClassName="bold"
                          display-decimals={bank.showDecimals}
                          callback-props={['savingsYearHeaders', 'goals', year]}
                          callback={callback} />
              &nbsp;(
              <StaticAmount bank={bank}>
                { bank.monthlyGoal[year] }
              </StaticAmount>
              /mo)
            </span>
          </FireTD>
          {bank.savingsInputsHidden.map((amount: any, idx: number) => (
          <FireTD show={this.state.collapsed} key={idx}>
            <StaticAmount bank={bank}>
              { bank.totalInstitution[year][amount.id][amount.type] }
            </StaticAmount>
          </FireTD>
          ))}
          <FireTD show={this.state.collapsed}>
            Total
          </FireTD>
          <FireTD show={this.state.collapsed}>
            <StaticAmount bank={bank}>
              { bank.totalHolding[this.props.year]['12'] }
            </StaticAmount>
          </FireTD>
          <FireTD show={this.state.collapsed}>
            {year}
          </FireTD>
          <FireTD show={this.state.collapsed} goal={bank.goalYearToDate[year]['12']} threshold={0}>
            <StaticAmount bank={bank}>
              { bank.goalYearToDate[year]['12'] }
            </StaticAmount>
          </FireTD>
          <FireTD show={this.state.collapsed} goal={bank.savingRateYear(year, '12')} threshold={0.5}>
            { bank.savingRateYear(year, '12') }
          </FireTD>
        </tr>
        {Object.entries(bank.savings[year]).map((month, idx) => (
        <tr key={idx} className={helpers.hideIf(this.state.collapsed)}>
          <td>{ month[0] }</td>
          {bank.savingsInputsHidden.map((amount: any, idx: number) => (
          <td key={idx}>
            {amount.type !== 'T' &&
            <FireAmount amount={_.get(month, [1, amount.id, amount.type])} 
                        display-decimals={bank.showDecimals}
                        callback-props={['savings', year, month[0], amount.id, amount.type]} 
                        callback={callback} />}
            {amount.type === 'T' && 
            <StaticAmount bank={bank}>
              {bank.totalMonthInstitution[year][month[0]][amount.id]}
            </StaticAmount>}
          </td>
          ))}
          <td>
            <StaticAmount bank={bank}>
              { bank.totalMonthSavings[year][month[0]] }
            </StaticAmount>
          </td>
          <FireTD show={bank.totalMonthSavings[year][month[0]] === 0} span={4} />
          <FireTD hide={bank.totalMonthSavings[year][month[0]] === 0}>
            <StaticAmount bank={bank}>
              { bank.totalHolding[year][month[0]] }
            </StaticAmount>
          </FireTD>
          <FireTD hide={bank.totalMonthSavings[year][month[0]] === 0} goal={bank.goalMonth[year][month[0]]} threshold={0}>
            <StaticAmount bank={bank}>
              { bank.goalMonth[year][month[0]] }
            </StaticAmount>
          </FireTD>
          <FireTD hide={bank.totalMonthSavings[year][month[0]] === 0} goal={bank.goalYearToDate[year][month[0]]} threshold={0}>
            <StaticAmount bank={bank}>
              { bank.goalYearToDate[year][month[0]] }
            </StaticAmount>
          </FireTD>
          <FireTD hide={bank.totalMonthSavings[year][month[0]] === 0} goal={bank.savingRateMonth(year, month[0])} threshold={0.5}>
            { bank.savingRateMonth(year, month[0]) }
          </FireTD>
        </tr>
        ))}
        <tr className={`tr-total ${helpers.hideIf(this.state.collapsed)}`}>
          <td><i className="fa fa-calendar-plus-o"></i></td>
          {bank.savingsInputsHidden.map((amount: any, idx: number) => (
          <td key={idx}>
            <StaticAmount bank={bank}>
              { bank.totalInstitution[year][amount.id][amount.type] }
            </StaticAmount>
          </td>
          ))}
          <td>Total</td>
          <td className="table-warning">
            <StaticAmount bank={bank}>
              { bank.totalHolding[year]['12'] }
            </StaticAmount>
          </td>
          <td>Goal</td>
          <td className={helpers.goal(bank.goalYearToDate[year]['12'], 0)}>
            <StaticAmount bank={bank}>
              { bank.goalYearToDate[year]['12'] }
            </StaticAmount>
          </td>
          <FireTD goal={bank.savingRateYear(year, '12')} threshold={0.5}>
            { bank.savingRateYear(year, '12') }
          </FireTD>
        </tr>
      </tbody>
    );
  }
};
