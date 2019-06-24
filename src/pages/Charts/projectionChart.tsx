import _ from 'lodash';
import React, { Dispatch, useEffect, useState } from 'react';
import Chart from 'react-google-charts';
import { connect } from 'react-redux';
import { Col, Row } from 'reactstrap';
import Button from 'reactstrap/lib/Button';
import ButtonGroup from 'reactstrap/lib/ButtonGroup';

import { loadBank } from '../../actions';
import Bank from '../../bank';
import { LoadingPanel } from '../../components';
import { AppState } from '../../store';

interface IProps {
  authUser: firebase.User|null;
  bank: Bank.IBank;
  bankLoaded: boolean;
  mobile: boolean;
  onLoadBank: (uid: string) => void;
}

const ProjectionChart = (props: IProps) => {
  const { authUser, bank, mobile, onLoadBank, bankLoaded } = props;
  const [savings, setSavings] = useState(60000);
  const [duration, setDuration] = useState(10);
  
  const last_year = _(bank.networth).values().last();
  const year = parseInt(_(bank.networth).keys().last() || '0');
  const month = parseInt(_(last_year).keys().last() || '0');
  const amount = _(last_year).values().last() || 0;

  useEffect(() => {
    if (!authUser || bankLoaded) return;
    
    onLoadBank(authUser.uid);
  }, [authUser, bankLoaded, onLoadBank]);

  if (!bankLoaded) return <LoadingPanel />;

  const data = [
    ['Date', '5%', '7%'],
    [new Date(year, month, 1), amount, amount]
  ];

  for (let i = 1; i <= duration; i++) {
    data.push([
      new Date(year + i, month, 1), 
      _.get(data, [data.length-1, 1]) * 1.05 + savings, 
      _.get(data, [data.length-1, 2]) * 1.07 + savings
    ]);
  }
  
  return (
    <Row>
      <Col md={1} sm={12}>
        <ButtonGroup color="outline-secondary" className="btn-block" vertical>
          <Button color={savings === 60000 ? 'secondary' : 'outline-secondary'} onClick={() => setSavings(60000)}>60k</Button>
          <Button color={savings === 70000 ? 'secondary' : 'outline-secondary'} onClick={() => setSavings(70000)}>70k</Button>
          <Button color={savings === 80000 ? 'secondary' : 'outline-secondary'} onClick={() => setSavings(80000)}>80k</Button>
          <Button color={savings === 90000 ? 'secondary' : 'outline-secondary'} onClick={() => setSavings(90000)}>90k</Button>
          <Button color={savings === 100000 ? 'secondary' : 'outline-secondary'} onClick={() => setSavings(100000)}>100k</Button>
        </ButtonGroup>
        <ButtonGroup className="btn-block" vertical>
          <Button color={duration === 10 ? 'secondary' : 'outline-secondary'} onClick={() => setDuration(10)}>10y</Button>
          <Button color={duration === 15 ? 'secondary' : 'outline-secondary'} onClick={() => setDuration(15)}>15y</Button>
          <Button color={duration === 20 ? 'secondary' : 'outline-secondary'} onClick={() => setDuration(20)}>20y</Button>
          <Button color={duration === 25 ? 'secondary' : 'outline-secondary'} onClick={() => setDuration(25)}>25y</Button>
          <Button color={duration === 30 ? 'secondary' : 'outline-secondary'} onClick={() => setDuration(30)}>30y</Button>
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
