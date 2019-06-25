import _ from 'lodash';
import React, { Dispatch, useEffect, useState } from 'react';
import Chart from 'react-google-charts';
import { connect } from 'react-redux';
import { RouteComponentProps } from 'react-router';
import { Col, Row } from 'reactstrap';
import Button from 'reactstrap/lib/Button';
import ButtonGroup from 'reactstrap/lib/ButtonGroup';

import { loadBank } from '../../actions';
import Bank from '../../bank';
import { LoadingPanel } from '../../components';
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
  const { authUser, bank, mobile, chart, onLoadBank, bankLoaded } = props;
  const [amount, setAmount] = useState(parseInt(_.get(props, 'match.params.amount')) || 60000);
  const [years, setYears] = useState(parseInt(_.get(props, 'match.params.years')) || 10);
  
  const last_year = _(bank.networth).values().last();
  const year = parseInt(_(bank.networth).keys().last() || '0');
  const month = parseInt(_(last_year).keys().last() || '0');
  const savings = _(last_year).values().last() || 0;

  useEffect(() => {
    if (!authUser || bankLoaded) return;
    
    onLoadBank(authUser.uid);
  }, [authUser, bankLoaded, onLoadBank]);

  const setRouteSavings = (s: number) => {
    const route = ROUTES.CHARTS_YEARS_AMOUNT
      .replace(':type', chart)
      .replace(':years', years.toString())
      .replace(':amount', s.toString());

    props.history.push(route);
    setAmount(s);
  }

  const setRouteDuration = (y: number) => {
    const route = ROUTES.CHARTS_YEARS_AMOUNT
      .replace(':type', chart)
      .replace(':years', y.toString())
      .replace(':amount', amount.toString());

    props.history.push(route);
    setYears(y);
  }

  const data = [
    ['Date', '5%', '7%'],
    [new Date(year, month, 1), savings, savings]
  ];

  for (let i = 1; i <= years; i++) {
    data.push([
      new Date(year + i, month, 1), 
      _.get(data, [data.length-1, 1]) * 1.05 + amount, 
      _.get(data, [data.length-1, 2]) * 1.07 + amount
    ]);
  }

  if (!bankLoaded) return <LoadingPanel />;
  
  return (
    <Row>
      <Col md={1} sm={12}>
        <ButtonGroup color="outline-secondary" className="btn-block" vertical>
          <Button color={amount === 60000 ? 'secondary' : 'outline-secondary'} onClick={() => setRouteSavings(60000)}>60k</Button>
          <Button color={amount === 70000 ? 'secondary' : 'outline-secondary'} onClick={() => setRouteSavings(70000)}>70k</Button>
          <Button color={amount === 80000 ? 'secondary' : 'outline-secondary'} onClick={() => setRouteSavings(80000)}>80k</Button>
          <Button color={amount === 90000 ? 'secondary' : 'outline-secondary'} onClick={() => setRouteSavings(90000)}>90k</Button>
          <Button color={amount === 100000 ? 'secondary' : 'outline-secondary'} onClick={() => setRouteSavings(100000)}>100k</Button>
        </ButtonGroup>
        <ButtonGroup className="btn-block" vertical>
          <Button color={years === 10 ? 'secondary' : 'outline-secondary'} onClick={() => setRouteDuration(10)}>10y</Button>
          <Button color={years === 15 ? 'secondary' : 'outline-secondary'} onClick={() => setRouteDuration(15)}>15y</Button>
          <Button color={years === 20 ? 'secondary' : 'outline-secondary'} onClick={() => setRouteDuration(20)}>20y</Button>
          <Button color={years === 25 ? 'secondary' : 'outline-secondary'} onClick={() => setRouteDuration(25)}>25y</Button>
          <Button color={years === 30 ? 'secondary' : 'outline-secondary'} onClick={() => setRouteDuration(30)}>30y</Button>
        </ButtonGroup>
      </Col>
      <Col md={11} sm={12}>
        <Chart
          chartType="LineChart"
          width="100%"
          height="460px"
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
