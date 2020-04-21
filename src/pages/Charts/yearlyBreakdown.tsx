import _ from 'lodash';
import React, { useState } from 'react';
import { connect } from 'react-redux';
import { RouteComponentProps } from 'react-router';
import { Col, CustomInput, Row } from 'reactstrap';

import Bank from '../../bank';
import { ButtonGroupSwitch } from '../../components';
import * as CHARTS from '../../constants/charts';
import { AppState } from '../../store';
import AllocationEvolutionChart, { IAllocationEvolutionChart } from './allocationEvolutionChart';
import BreakEvenPointChart, { IBreakEvenPointChartData } from './breakEvenPointChart';
import IncomeVsSavingsChart, { IIncomeVsSavingsChartData } from './incomeVsSavingsChart';
import NetWorthVsSavingsChart, { INetWorthVsSavingsChartData } from './netWorthVsSavingsChart';
import YearlyGoalBurnUp, { IYearlyGoalBurnUpChartData } from './yearlyGoalBurnUp';

type IChartData =
  | IIncomeVsSavingsChartData
  | INetWorthVsSavingsChartData
  | IAllocationEvolutionChart
  | IBreakEvenPointChartData
  | IYearlyGoalBurnUpChartData;

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
  'no-switch': noSwitch,
}: IProps & RouteComponentProps) => {
  const [year, setYear] = useState(hideAll ? new Date().getFullYear() : 0);
  const [percentage, setPercentage] = useState(false);
  const dataYears = _.uniq(
    (data as IChartData[]).map((v) => new Date(v.date).getFullYear())
  );
  const filteredData = (data as IChartData[]).filter(
    (v) => year === 0 || new Date(v.date).getFullYear() === year
  );

  if (!hideAll) dataYears.unshift(0);

  const clickDate = (y: number) => {
    setYear(y);
  };

  return (
    <>
      <Row>
        {!noSwitch && (
          <Col xs={6} sm={{ size: 2, offset: 8 }}>
            <ButtonGroupSwitch
              className="d-flex mb-3"
              value={percentage}
              setValue={setPercentage}
              colors={['primary', 'darker']}
              values={[false, true]}
              nodes={['$', '%']}
            />
          </Col>
        )}
        <Col
          xs={{ size: 6, offset: noSwitch ? 6 : 0 }}
          sm={{ size: 2, offset: noSwitch ? 10 : 0 }}
        >
          <CustomInput
            id="year-custom-input"
            type="select"
            value={year}
            className="mb-3"
            onChange={(e) => clickDate(parseInt(e.target.value))}
          >
            {dataYears.map((y) => (
              <option value={y} key={y}>
                {y === 0 ? 'All' : y}
              </option>
            ))}
          </CustomInput>
        </Col>
        <Col xs={12}>
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
    </>
  );
};

const mapStateToProps = (state: AppState) => {
  return {
    bank: state.bankState.bank,
    darkMode: state.sessionState.darkMode,
  };
};

export default connect(mapStateToProps)(YearlyBreakdown);
