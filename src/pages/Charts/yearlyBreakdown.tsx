import _ from 'lodash';
import React, { useState } from 'react';
import { connect } from 'react-redux';
import { RouteComponentProps } from 'react-router';
import { Col, ListGroup, ListGroupItem, Row } from 'reactstrap';

import Bank from '../../bank';
import { ButtonGroupSwitch, NavButtonGroup } from '../../components';
import * as CHARTS from '../../constants/charts';
import { AppState } from '../../store';
import {
    AllocationEvolutionChart, BreakEvenPointChart, IncomeVsSavingsChart, NetWorthVsSavingsChart,
    YearlyGoalBurnUp
} from './charts';
import {
    IAllocationEvolutionChart, IBreakEvenPointChartData, IChartData, IIncomeVsSavingsChartData,
    INetWorthVsSavingsChartData, IYearlyGoalBurnUpChartData
} from './interfaces';

interface IProps {
  bank: Bank.IBank;
  data: IChartData[];
  mobile: boolean;
  chart: string;
  darkMode: boolean;
  'hide-all'?: boolean;
  'no-switch'?: boolean;
}

const YearlyBreakdown = ({
  chart,
  data,
  mobile,
  darkMode,
  bank,
  'hide-all': hideAll,
  'no-switch': noSwitch
}: IProps & RouteComponentProps) => {
  const [year, setYear] = useState(hideAll ? new Date().getFullYear() : 0);
  const [percentage, setPercentage] = useState(false);
  const dataYears = _.uniq(
    (data as IChartData[]).map(v => new Date(v.date).getFullYear())
  );
  const filteredData = (data as IChartData[]).filter(
    v => year === 0 || new Date(v.date).getFullYear() === year
  );

  if (!hideAll) dataYears.unshift(0);

  const clickDate = (y: number) => {
    setYear(y);
  };

  const prevYear = () => {
    setYear(year === bank.headers.firstYear ? 0 : year - 1);
  };

  const nextYear = () => {
    setYear(year === 0 ? bank.headers.firstYear : year + 1);
  };

  return (
    <Row>
      <Col md={2} sm={12}>
        {!mobile && !noSwitch && (
          <ButtonGroupSwitch
            className="d-flex mb-3"
            value={percentage}
            setValue={setPercentage}
            colors={['primary', 'darker']}
            values={[false, true]}
            nodes={['$', '%']}
          />
        )}
        {!mobile && (
          <ListGroup>
            {dataYears.map(y => (
              <ListGroupItem
                key={y}
                className="text-left cursor"
                color={y === year ? 'primary' : 'darker'}
                onClick={() => clickDate(y)}
              >
                {y === 0 ? 'All' : y}
              </ListGroupItem>
            ))}
          </ListGroup>
        )}
        {mobile && (
          <NavButtonGroup
            color="light"
            button-color="outline-secondary"
            on-click={[prevYear, nextYear]}
            disabled={[year === 0, year === new Date().getFullYear()]}
            label={year === 0 ? 'All' : year.toString()}
          />
        )}
      </Col>
      <Col md={10} sm={12} className="chart-container">
        {chart === CHARTS.URL.INCOME_VS_SAVINGS && (
          <IncomeVsSavingsChart
            data={filteredData as IIncomeVsSavingsChartData[]}
            mobile={mobile}
            darkMode={darkMode}
          />
        )}
        {chart === CHARTS.URL.NET_WORTH_VS_SAVINGS && (
          <NetWorthVsSavingsChart
            percentage={percentage}
            data={filteredData as INetWorthVsSavingsChartData[]}
            mobile={mobile}
            darkMode={darkMode}
          />
        )}
        {chart === CHARTS.URL.ALLOCATION_EVOLUTION && (
          <AllocationEvolutionChart
            percentage={percentage}
            data={filteredData as IAllocationEvolutionChart[]}
            mobile={mobile}
            darkMode={darkMode}
          />
        )}
        {chart === CHARTS.URL.BREAK_EVEN_POINT && (
          <BreakEvenPointChart
            data={filteredData as IBreakEvenPointChartData[]}
            mobile={mobile}
            darkMode={darkMode}
          />
        )}
        {chart === CHARTS.URL.YEARLY_GOAL_BURNUP && (
          <YearlyGoalBurnUp
            data={filteredData as IYearlyGoalBurnUpChartData[]}
            mobile={mobile}
            darkMode={darkMode}
          />
        )}
      </Col>
    </Row>
  );
};

const mapStateToProps = (state: AppState) => {
  return {
    bank: state.bankState.bank,
    darkMode: state.sessionState.darkMode
  };
};

export default connect(mapStateToProps)(YearlyBreakdown);
