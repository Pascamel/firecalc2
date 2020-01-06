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
import { IArrayDateNumber, IArrayDateNumberNull } from './interfaces';

interface IProps {
  bank: Bank.IBank;
  data: IArrayDateNumber | IArrayDateNumberNull;
  mobile: boolean; 
  chart: string;
  darkMode: boolean;
}

const YearlyBreakdown = (props: IProps & RouteComponentProps) => {
  const { chart, data, mobile, darkMode, bank } = props;
  const [year, setYear] = useState(2016); //0);

  const dataYears = [0, ..._.uniq(Object.entries(data).filter(v => (v[1][0] instanceof Date)).map(v => v[1][0].getFullYear()))];

  const clickDate = (y: number) => {
    setYear(y);
  }

  const prevYear = () => {
    setYear(year === bank.headers.firstYear ? 0 : year - 1);
  }

  const nextYear = () => {
    setYear(year === 0 ? bank.headers.firstYear : year + 1);
  }

  const filteredData = Object.entries(data).filter(v => year === 0 || !(v[1][0] instanceof Date) || v[1][0].getFullYear() === year).map(v => v[1]);

  // google charts chokes if all values are null - so this will do till a better fix is found
  if (chart === CHARTS.URL.NET_WORTH_VS_SAVINGS && filteredData[filteredData.length - 1][1]===null) {
    const serie1 = filteredData.map(v => v[1]);
    const serie2 = filteredData.map(v => v[2]);
    
    serie1.shift();
    serie2.shift();

    if (_.compact(serie1).length === 0) {
      filteredData[filteredData.length - 1][1] = 0;
    }
    if (_.compact(serie2).length === 0) {
      filteredData[filteredData.length - 1][2] = 0;
    }
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
        {chart === CHARTS.URL.INCOME_VS_SAVINGS && <Charts.IncomeVsSavingsChart data={filteredData} mobile={mobile} darkMode={darkMode} />}
        {chart === CHARTS.URL.NET_WORTH_VS_SAVINGS && <Charts.NetWorthVsSavingsChart data={filteredData} mobile={mobile} darkMode={darkMode} />}
        {chart === CHARTS.URL.ALLOCATION_EVOLUTION && <Charts.AllocationEvolutionChart data={filteredData} mobile={mobile} darkMode={darkMode} />}
        {chart === CHARTS.URL.BREAK_EVEN_POINT && <Charts.BreakEvenPointChart data={filteredData} mobile={mobile} darkMode={darkMode} />}
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
