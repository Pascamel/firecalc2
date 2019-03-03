import React, { Component } from 'react';
import _ from 'lodash';

import FireAmount from '../../components/FireAmount';
import FireTD from '../../components/fireTD';
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
              Begins at <b>{ bank.startOfYearAmount(year) }</b> - Goal is&nbsp;
              <FireAmount amount={_.get(bank, ['savingsYearHeaders', 'goals', year])}
                          extraClassName="bold"
                          display-decimals={bank.showDecimals}
                          callback-props={['savingsYearHeaders', 'goals', year]}
                          callback={callback} />
              &nbsp;({ bank.monthlyGoal(year) }/mo)
            </span>
          </FireTD>
          {bank.savingsInputsHidden.map((amount: any, idx: number) => (
          <FireTD show={this.state.collapsed} key={idx}>
            { bank.totalInstitution(year, amount.id, amount.type) }
          </FireTD>
          ))}
          <FireTD show={this.state.collapsed}>
            Total
          </FireTD>
          <FireTD show={this.state.collapsed}>
            { bank.totalHolding('12', this.props.year) }
          </FireTD>
          <FireTD show={this.state.collapsed}>
            {year}
          </FireTD>
          <FireTD show={this.state.collapsed} goal={bank.goalYearToDate('12', this.props.year)} threshold={0}>
            { bank.goalYearToDate('12', year) }
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
            {amount.type === 'T' && bank && bank.totalMonthInstitution(year, month[0], amount.id)}
          </td>
          ))}
          <td>{ bank.totalMonthSavings(month[0], year, 'T') }</td>
          <FireTD show={bank.totalMonthSavings(month[0], year, 'T') === 0} span={4} />
          <FireTD hide={bank.totalMonthSavings(month[0], year, 'T') === 0}>
            { bank.totalHolding(month[0], year) }
          </FireTD>
          <FireTD hide={bank.totalMonthSavings(month[0], year, 'T') === 0} goal={bank.goalMonth(month[0], year)} threshold={0}>
            { bank.goalMonth(month[0], year) }
          </FireTD>
          <FireTD hide={bank.totalMonthSavings(month[0], year, 'T') === 0} goal={bank.goalYearToDate(month[0], year)} threshold={0}>
            { bank.goalYearToDate(month[0], year) }
          </FireTD>
          <FireTD hide={bank.totalMonthSavings(month[0], year, 'T') === 0} goal={bank.savingRateMonth(year, month[0])} threshold={0.5}>
            { bank.savingRateMonth(year, month[0]) }
          </FireTD>
        </tr>
        ))}
        <tr className={`tr-total ${helpers.hideIf(this.state.collapsed)}`}>
          <td><i className="fa fa-calendar-plus-o"></i></td>
          {bank.savingsInputsHidden.map((amount: any, idx: number) => (
          <td key={idx}>
            { bank.totalInstitution(year, amount.id, amount.type) }
          </td>
          ))}
          <td>Total</td>
          <td className="table-warning">{ bank.totalHolding('12', year) }</td>
          <td>Goal</td>
          <td className={helpers.goal(bank.goalYearToDate('12', year), 0)}>
            { bank.goalYearToDate('12', year) }
          </td>
          <FireTD goal={bank.savingRateYear(year, '12')} threshold={0.5}>
            { bank.savingRateYear(year, '12') }
          </FireTD>
        </tr>
      </tbody>
    );
  }
};
