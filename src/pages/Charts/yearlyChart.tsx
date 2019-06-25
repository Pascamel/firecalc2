import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import _ from 'lodash';
import React, { useState } from 'react';
import { connect } from 'react-redux';
import { RouteComponentProps } from 'react-router';
import { Badge, Button, ButtonGroup, Col, ListGroup, ListGroupItem, Row } from 'reactstrap';

import Bank from '../../bank';
import * as CHARTS from '../../constants/charts';
import * as ROUTES from '../../constants/routes';
import helpers from '../../helpers';
import { AppState } from '../../store';
import * as Charts from './charts';
import { IYearlyChartData } from './interfaces';

interface IProps {
  bank: Bank.IBank;
  data: {[year: number]: IYearlyChartData};
  mobile: boolean; 
  chart: string;
}

const YearlyChart = (props: IProps & RouteComponentProps) => {
  const { bank, data, mobile, chart } = props;
  const [year, setYear] = useState(parseInt(_.get(props, 'match.params.year')) || new Date().getFullYear())

  const clickDate = (y: number) => {
    const route = ROUTES.CHARTS_YEAR.replace(':type', chart).replace(':year', y.toString());
    props.history.push(route);
    setYear(y);
  }

  const prevYear = () => {
    const route = ROUTES.CHARTS_YEAR.replace(':type', chart).replace(':year', (year - 1).toString());
    props.history.push(route);
    setYear(year - 1);
  }

  const nextYear = () => {
    const route = ROUTES.CHARTS_YEAR.replace(':type', chart).replace(':year', (year + 1).toString());
    props.history.push(route);
    setYear(year + 1);
  }

  const percentageYear = (y: string) => {
    const month = (parseInt(y) === (new Date().getFullYear())) ? (new Date().getMonth() + 1) : 12;

    return bank.goalYearToDate[y][month] / bank.monthlyGoal[y] / 12
  }
    
  return (
    <Row>
      <Col md={2} sm={12}>
        {!mobile && <ListGroup>
          {Object.entries(data).map((y) => ( 
            <ListGroupItem key={y[0]} className="text-left" color={parseInt(y[0]) === year ? 'secondary' : 'link'} tag={Button} onClick={() => clickDate(parseInt(y[0]))}>
              {y[0]}
              <Badge color={percentageYear(y[0]) > 0 ? 'success' : 'danger'} pill className="pull-right mt-1">
                {helpers.percentage(percentageYear(y[0]), 0, true)}
              </Badge>
            </ListGroupItem>
          ))} 
        </ListGroup>}
        {mobile && <ButtonGroup style={{width: '100%'}} color="light" className="mb-3">
          <Button color="outline-secondary" onClick={prevYear} disabled={year === bank.headers.firstYear}>
            <FontAwesomeIcon icon="backward" />
          </Button>
          <Button color="outline-secondary" disabled={true} block>
            {year}
          </Button>
          <Button color="outline-secondary" onClick={nextYear} disabled={year === (new Date()).getFullYear()}>
            <FontAwesomeIcon icon="forward" />
          </Button>
        </ButtonGroup>}
      </Col>
      <Col md={10} sm={12}>
        {chart === CHARTS.URL.YEARLY_GOAL_BURNUP && <Charts.YearlyGoalBurnUp data={data[year]} mobile={mobile} year={year} />}
      </Col>
    </Row>
  );
}

const mapStateToProps = (state: AppState) => {
  return ({
    bank: state.bankState.bank,
  });
}

export default connect(mapStateToProps)(YearlyChart);
