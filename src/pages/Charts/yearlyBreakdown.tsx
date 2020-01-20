import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import _ from 'lodash';
import React, { useState } from 'react';
import { connect } from 'react-redux';
import { RouteComponentProps } from 'react-router';
import { Button, ButtonGroup, Col, ListGroup, ListGroupItem, Row } from 'reactstrap';

import Bank from '../../bank';
import * as CHARTS from '../../constants/charts';
import { AppState } from '../../store';
import * as Charts from './charts';
import { IAllocationEvolutionChart, IBreakEvenPointChartData, IChartData, IIncomeVsSavingsChartData, INetWorthVsSavingsChartData, IYearlyGoalBurnUpChartData } from './interfaces';

interface IProps {
  bank: Bank.IBank;
  data: IChartData[];
  mobile: boolean; 
  chart: string;
  darkMode: boolean;
  hideAll?: boolean;
}

const YearlyBreakdown = (props: IProps & RouteComponentProps) => {
  const { chart, data, mobile, darkMode, bank, hideAll } = props;  

  const [year, setYear] = useState(hideAll ? new Date().getFullYear() : 0);
  const dataYears = _.uniq((data as IChartData[]).map(v => new Date(v.date).getFullYear()));
  const filteredData = (data as IChartData[]).filter(v => year === 0 || new Date(v.date).getFullYear() === year);

  if (!hideAll) dataYears.unshift(0);

  const clickDate = (y: number) => {
    setYear(y);
  }

  const prevYear = () => {
    setYear(year === bank.headers.firstYear ? 0 : year - 1);
  }

  const nextYear = () => {
    setYear(year === 0 ? bank.headers.firstYear : year + 1);
  }

  return (
    <Row>
      <Col md={2} sm={12}>
        {!mobile && <ListGroup>
          {dataYears.map((y) => ( 
            <ListGroupItem key={y} className="text-left" color={y === year ? 'secondary' : 'link'} tag={Button} onClick={() => clickDate(y)}>
              {y === 0 ? 'All' : y}
            </ListGroupItem>
          ))} 
        </ListGroup>}
        {mobile && <ButtonGroup style={{width: '100%'}} color="light" className="mb-3">
          <Button color="outline-secondary" onClick={prevYear} disabled={year === 0}>
            <FontAwesomeIcon icon="backward" />
          </Button>
          <Button color="outline-secondary" disabled={true} block>
          {year === 0 ? 'All' : year}
          </Button>
          <Button color="outline-secondary" onClick={nextYear} disabled={year === (new Date()).getFullYear()}>
            <FontAwesomeIcon icon="forward" />
          </Button>
        </ButtonGroup>}
      </Col>
      <Col md={10} sm={12} className="chart-container">
        {chart === CHARTS.URL.INCOME_VS_SAVINGS && <Charts.IncomeVsSavingsChart data={filteredData as IIncomeVsSavingsChartData[]} mobile={mobile} darkMode={darkMode} />}
        {chart === CHARTS.URL.NET_WORTH_VS_SAVINGS && <Charts.NetWorthVsSavingsChart data={filteredData as INetWorthVsSavingsChartData[]} mobile={mobile} darkMode={darkMode} />}
        {chart === CHARTS.URL.ALLOCATION_EVOLUTION && <Charts.AllocationEvolutionChart data={filteredData as IAllocationEvolutionChart[]} mobile={mobile} darkMode={darkMode} />}
        {chart === CHARTS.URL.BREAK_EVEN_POINT && <Charts.BreakEvenPointChart data={filteredData as IBreakEvenPointChartData[]} mobile={mobile} darkMode={darkMode} />}
        {chart === CHARTS.URL.YEARLY_GOAL_BURNUP && <Charts.YearlyGoalBurnUp data={filteredData as IYearlyGoalBurnUpChartData[]} mobile={mobile} darkMode={darkMode} />}
      </Col>
    </Row>
  )
}

const mapStateToProps = (state: AppState) => {
  return ({
    bank: state.bankState.bank,
    darkMode: state.sessionState.darkMode,
  });
}

export default connect(mapStateToProps)(YearlyBreakdown);
