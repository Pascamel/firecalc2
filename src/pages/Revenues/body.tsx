import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import _ from 'lodash';
import React, { Dispatch } from 'react';
import { connect } from 'react-redux';

import { updateValueLocalStorage } from '../../actions';
import Bank from '../../bank';
import { FireAmount, FireTD, FireTR, StaticAmount, StaticPercentage } from '../../components';
import { AppState } from '../../store';

interface IProps {
  year: string;
  bank: Bank.IBank;
  onUpdateValueLocalStorage: (index: string, indexes: string[], amount: number | boolean) => void;
}

interface IState {
  collapsed: boolean;
}

class RevenuesTableBody extends React.Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);
    

    this.state = {collapsed: _.get(props.bank.incomeYearHeaders, ['collapsed', props.year], false)};
    this.handleClickToggle = this.handleClickToggle.bind(this);
  }

  handleClickToggle() {
    const newValue = !this.state.collapsed;
    this.setState({collapsed: newValue});

    this.props.onUpdateValueLocalStorage('incomeYearHeaders', ['collapsed', this.props.year], newValue);
  }

  render() {
    const { year, bank } = this.props;

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
          {bank.incomeHeaders.map((header) => (
          <FireTD show={this.state.collapsed} key={header.id}>
            <StaticAmount display-zero>
              { bank.yearlyIncome[year][header.id] }
            </StaticAmount>
          </FireTD>
          ))}
          <FireTD show={this.state.collapsed}>
            <StaticAmount display-zero>
              { bank.totalYearPost[year] }
            </StaticAmount>
          </FireTD>
          <FireTD show={this.state.collapsed}>
            <StaticAmount display-zero>
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
          {bank.incomeHeaders.map((header) => (
          <td key={year + '-' + month[0] + '-' + header.id}>
            <FireAmount callback-props={['income', year, month[0], header.id]} />
          </td>
          ))}
          {bank.totalMonthIncome[year][month[0]] === 0 && <td colSpan={3}></td>}
          {bank.totalMonthIncome[year][month[0]] !== 0 && <>
            <td>
              <StaticAmount>
                { bank.totalMonthPost[year][month[0]] }
              </StaticAmount>
            </td>
            <td>
              <StaticAmount>
                { bank.totalMonthPre[year][month[0]] }
              </StaticAmount>
            </td>
            <FireTD goal={bank.savingRateMonth[year][month[0]]} threshold={0.5}>
              <StaticPercentage>
                { bank.savingRateMonth[year][month[0]] }
              </StaticPercentage>
            </FireTD>
          </>}
        </FireTR>
        ))}

        <FireTR hide={this.state.collapsed}>
          <td>
            <FontAwesomeIcon icon={['far', 'calendar-alt']} />
          </td>
          {bank.incomeHeaders.map((header: any) => (
          <td key={header.id}>
            <StaticAmount display-zero>
              { bank.yearlyIncome[year][header.id] }
            </StaticAmount>
          </td>
          ))}
          <td>
            <StaticAmount display-zero>
              { bank.totalYearPost[year] }
            </StaticAmount>
          </td>
          <td>
            <StaticAmount display-zero>
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

const mapStateToProps = (state: AppState) => {
  return ({
    bank: state.bankState.bank
  });
}

const mapDispatchToProps = (dispatch: Dispatch<any>) => {
  return {
    onUpdateValueLocalStorage: (index: string, indexes: string[], amount: number | boolean) => {
      dispatch(updateValueLocalStorage(index, indexes, amount));
    }
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(RevenuesTableBody);
