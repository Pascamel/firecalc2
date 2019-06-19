import _ from 'lodash';
import React, { Dispatch } from 'react';
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

interface IState {
  savings: number;
  duration: number;
}

class ProjectionChart extends React.Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);

    this.state= {
      savings: 60000,
      duration: 10
    };
  }

  componentDidMount() {
    const { authUser, onLoadBank, bankLoaded } = this.props;
    if (!authUser || bankLoaded) return;
    
    onLoadBank(authUser.uid);
  }
  
  render() {
    if (!this.props.bankLoaded) return <LoadingPanel />;

    const last_year = _(this.props.bank.networth).values().last();
  
    const year = parseInt(_(this.props.bank.networth).keys().last() || '0');
    const month = parseInt(_(last_year).keys().last() || '0');
    const amount = _(last_year).values().last() || 0;

    const data = [
      ['Date', '5%', '7%'],
      [new Date(year, month, 1), amount, amount]
    ];

    var i: number; 
    for (i = 1; i <= this.state.duration; i++) {
      data.push([
        new Date(year + i, month, 1), 
        data[data.length-1][1] * 1.05 + this.state.savings, 
        data[data.length-1][2] * 1.07 + this.state.savings
      ]);
    }
    
    return (
      <Row>
        <Col md={1} sm={12}>
          <ButtonGroup color="outline-secondary" className="btn-block" vertical>
            <Button color={this.state.savings === 60000 ? 'secondary' : 'outline-secondary'} onClick={() => this.setState({savings: 60000})}>60k</Button>
            <Button color={this.state.savings === 70000 ? 'secondary' : 'outline-secondary'} onClick={() => this.setState({savings: 70000})}>70k</Button>
            <Button color={this.state.savings === 80000 ? 'secondary' : 'outline-secondary'} onClick={() => this.setState({savings: 80000})}>80k</Button>
            <Button color={this.state.savings === 90000 ? 'secondary' : 'outline-secondary'} onClick={() => this.setState({savings: 90000})}>90k</Button>
            <Button color={this.state.savings === 100000 ? 'secondary' : 'outline-secondary'} onClick={() => this.setState({savings: 100000})}>100k</Button>
          </ButtonGroup>
          <ButtonGroup className="btn-block" vertical>
            <Button color={this.state.duration === 10 ? 'secondary' : 'outline-secondary'} onClick={() => this.setState({duration: 10})}>10y</Button>
            <Button color={this.state.duration === 15 ? 'secondary' : 'outline-secondary'} onClick={() => this.setState({duration: 15})}>15y</Button>
            <Button color={this.state.duration === 20 ? 'secondary' : 'outline-secondary'} onClick={() => this.setState({duration: 20})}>20y</Button>
            <Button color={this.state.duration === 25 ? 'secondary' : 'outline-secondary'} onClick={() => this.setState({duration: 25})}>25y</Button>
            <Button color={this.state.duration === 30 ? 'secondary' : 'outline-secondary'} onClick={() => this.setState({duration: 30})}>30y</Button>
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
                width: this.props.mobile ? '80%' : '92%', 
                right: this.props.mobile ? '5%' : '2%',
                height: '80%'
              }
            }}
          />
        </Col>
      </Row>
    );
  }
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
