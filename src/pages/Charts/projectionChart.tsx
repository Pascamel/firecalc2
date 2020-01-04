import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import _ from 'lodash';
// import Tooltip from 'material-ui/internal/Tooltip';
import React, { Dispatch, useEffect, useState } from 'react';
import Chart from 'react-google-charts';
import { connect } from 'react-redux';
import { RouteComponentProps } from 'react-router';
import { Badge, Button, ButtonGroup, Col, ListGroup, ListGroupItem, Row, Tooltip } from 'reactstrap';

import { loadBank } from '../../actions';
import Bank from '../../bank';
import { LoadingPanel, StaticAmount } from '../../components';
import * as ROUTES from '../../constants/routes';
import { AppState } from '../../store';

interface IProps {
  authUser: firebase.User|null;
  bank: Bank.IBank;
  bankLoaded: boolean;
  mobile: boolean;
  chart: string;
  onLoadBank: (uid: string) => void;
}

const ProjectionChart = (props: IProps & RouteComponentProps) => {

  const DEFAULT_AMOUNTS = [80000, 90000, 100000, 110000, 120000, 130000, 150000];
  const DEFAULT_AMOUNT = 80000;
  const DEFAULT_YEARS = [10, 15, 20, 25, 30];
  const DEFAULT_YEAR = 10;
  
  const { authUser, bank, mobile, chart, onLoadBank, bankLoaded } = props;
  const [amount, setAmount] = useState(parseInt(_.get(props, 'match.params.amount')) || DEFAULT_AMOUNT);
  const [years, setYears] = useState(parseInt(_.get(props, 'match.params.years')) || DEFAULT_YEAR);

  const networthActualValues = Object.keys(bank.networth)
    .filter(k => _.keys(bank.networth[k]).length > 0)
    .reduce((object, k) => {
      object[k] = bank.networth[k]
      return object;
    }, {} as {[year: string]: any});

  const last_year = _(networthActualValues).values().last();
  const year = parseInt(_(networthActualValues).keys().last() || '0');
  const month = parseInt(_(last_year).keys().last() || '0');
  const savings = parseFloat(_(last_year).values().last() || '0');

  const [tooltipValue, setTooltipValue] = useState(0);
  const [tooltipOpen, setTooltipOpen] = useState(false);

  const toggleTooltip = (v: number) => {
    setTooltipValue(v);
    setTooltipOpen(!tooltipOpen);
  }

  useEffect(() => {
    if (!authUser || bankLoaded) return;
    
    onLoadBank(authUser.uid);
  }, [authUser, bankLoaded, onLoadBank]);

  const setRouteAmount = (s: number) => {
    const route = ROUTES.CHARTS_YEARS_AMOUNT
      .replace(':type', chart)
      .replace(':years', years.toString())
      .replace(':amount', s.toString());

    props.history.push(route);
    setAmount(s);
  }

  const setRouteYears = (y: number) => {
    const route = ROUTES.CHARTS_YEARS_AMOUNT
      .replace(':type', chart)
      .replace(':years', y.toString())
      .replace(':amount', amount.toString());

    props.history.push(route);
    setYears(y);
  }

  const prevAmount = () => {
    const index = DEFAULT_AMOUNTS.indexOf(amount);
    if (index <= 0) return;

    setRouteAmount(DEFAULT_AMOUNTS[index - 1]);
  }

  const nextAmount = () => {
    const index = DEFAULT_AMOUNTS.indexOf(amount);
    if (index >= DEFAULT_AMOUNTS.length - 1) return;

    setRouteAmount(DEFAULT_AMOUNTS[index + 1]);
  }

  const prevYear = () => {
    const index = DEFAULT_YEARS.indexOf(years);
    if (index <= 0) return;

    setRouteYears(DEFAULT_YEARS[index - 1]);
  }

  const nextYear = () => {
    const index = DEFAULT_YEARS.indexOf(years);
    if (index >= DEFAULT_YEARS.length - 1) return;

    setRouteYears(DEFAULT_YEARS[index + 1]);
  }

  const data = [
    ['Date', '5%', '7%'],
    [new Date(year, month, 1), savings, savings]
  ];

  for (let i = 1; i <= years; i++) {    
    data.push([
      new Date(year + i, month, 1), 
      (_.get(data, [data.length-1, 1]) as number) * 1.05 + amount, 
      (_.get(data, [data.length-1, 2]) as number) * 1.07 + amount
    ]);
  }

  if (!bankLoaded) return <LoadingPanel />;
  
  return (
    <Row>
      <Col md={2} sm={12}>
        {!mobile && 
        <ListGroup>
          {DEFAULT_AMOUNTS.map(v => (
            <ListGroupItem key={v} className="text-left" color={amount === v ? 'secondary' : 'link'} tag={Button} onClick={() => setRouteAmount(v)}>
              $<StaticAmount display-zero hide-decimals>
                {v}
              </StaticAmount>
              <Badge id={`tooltipIcon${v}`} pill className="pull-right mt-1">
                <FontAwesomeIcon icon="info" size="sm" />
                <Tooltip placement="top" isOpen={tooltipOpen && tooltipValue===v} autohide={false} target={`tooltipIcon${v}`} toggle={() => toggleTooltip(v)}>
                  $<StaticAmount display-zero hide-decimals>
                    {v/12}
                  </StaticAmount> / mo
                </Tooltip>
              </Badge>
            </ListGroupItem>
          ))}
        </ListGroup>}
        {!mobile && <ListGroup className="mt-3">
          {DEFAULT_YEARS.map(v => (
            <ListGroupItem key={v} className="text-left" color={years === v ? 'secondary' : 'link'} tag={Button} onClick={() => setRouteYears(v)}>
              {v} years
            </ListGroupItem>
          ))}
        </ListGroup>}
        {mobile && <ButtonGroup style={{width: '100%'}} color="light" className="mb-3">
          <Button color="outline-secondary" onClick={prevAmount} disabled={amount === DEFAULT_AMOUNTS[0]}>
            <FontAwesomeIcon icon="backward" />
          </Button>
          <Button color="outline-secondary" disabled={true} block>
            $<StaticAmount display-zero hide-decimals>
              {amount}
            </StaticAmount>
          </Button>
          <Button color="outline-secondary" onClick={nextAmount} disabled={amount === DEFAULT_AMOUNTS[DEFAULT_AMOUNTS.length - 1]}>
            <FontAwesomeIcon icon="forward" />
          </Button>
        </ButtonGroup>}
        {mobile && <ButtonGroup style={{width: '100%'}} color="light" className="mb-3">
          <Button color="outline-secondary" onClick={prevYear} disabled={years === DEFAULT_YEARS[0]}>
            <FontAwesomeIcon icon="backward" />
          </Button>
          <Button color="outline-secondary" disabled={true} block>
            {years} years
          </Button>
          <Button color="outline-secondary" onClick={nextYear} disabled={years === DEFAULT_YEARS[DEFAULT_YEARS.length - 1]}>
            <FontAwesomeIcon icon="forward" />
          </Button>
        </ButtonGroup>}
      </Col>
      <Col md={10} sm={12} className="chart-container">
        <Chart
          chartType="LineChart"
          width="100%"
          height="99%"
          loader={<LoadingPanel color="background" />}
          data={data}
          options={{
            legend: { position: 'top', alignment: 'start' },
            hAxis: { type: 'date'},
            vAxis: { 
              format: 'short'
            },
            series: {
              0: { curveType: 'function' },
              1: { curveType: 'function' },
            },
            chartArea: { 
              width: mobile ? '80%' : '92%', 
              right: mobile ? '5%' : '2%',
              height: '80%'
            }
          }}
        />
      </Col>
    </Row>
  );
}

const mapStateToProps = (state: AppState) => {
  return ({
    authUser: state.sessionState.authUser,
    bank: state.bankState.bank,
    bankLoaded: state.bankState.bankLoaded
  });
}

const mapDispatchToProps = (dispatch: Dispatch<any>) => {
  return {
    onLoadBank: (uid: string) => dispatch(loadBank(uid))
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ProjectionChart);
