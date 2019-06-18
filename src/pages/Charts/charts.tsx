import React from 'react';
import { Chart } from 'react-google-charts';

import { LoadingPanel } from '../../components';

interface IProps {
  data: any,
  mobile: boolean
}

interface IYear {
  year: number;
}

export class IncomeVsSavingsChart extends React.Component<IProps, {}> {
  render() {
    return (
      <Chart
        chartType="LineChart"
        width="100%"
        height="460px"
        loader={<LoadingPanel color="background" />}
        data={this.props.data}
        options={{
          legend: { position: 'top', alignment: 'start' },
          hAxis: { type: 'date'},
          vAxis: { 
            format: 'short',
            viewWindow: {
              min: 0
            }
          },
          series: {
            0: { curveType: 'function' },
            1: { curveType: 'function' },
          },
          chartArea: { 
            width: this.props.mobile ? '82%' : '93%',
            right: this.props.mobile ? '5%' : '2%',
            height: '80%'
          }
        }}
      />
    );
  }
}

export class NetWorthVsSavingsChart extends React.Component<IProps, {}> {
  render() {
    return (
      <Chart
        chartType="LineChart"
        width="100%"
        height="460px"
        loader={<LoadingPanel color="background" />}
        data={this.props.data}
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
    );
  }
}

export class SavingsBreakdownChart extends React.Component<IProps, {}> {
  render() {
    return (
      <Chart
        chartType="PieChart"
        width="100%"
        height="460px"
        loader={<LoadingPanel color="background" />}
        data={this.props.data}
        options={{
          legend: {
            position: this.props.mobile ? 'bottom' : 'labeled',
          },
          pieSliceText: 'value',
          pieStartAngle: 100,
          chartArea: {
            width: this.props.mobile ? '90%' : '96%', 
            height: '90%'
          }
        }}
      />
    );
  }
}

export class AllocationEvolutionChart extends React.Component<IProps, {}> {
  render() {
    return (
      <Chart 
        chartType="AreaChart"
        width="100%"
        height="460px"
        loader={<LoadingPanel color="background" />}
        data={this.props.data}
        legendToggle
        options={{
          isStacked: true,
          legend: { position: 'top', alignment: 'start' },
          hAxis: { type: 'date'},
          vAxis: { 
            format: 'short',
            viewWindow: {
              min: 0
            }
          },
          chartArea: {
            width: this.props.mobile ? '80%' : '92%', 
            right: this.props.mobile ? '5%' : '2%',
            height: '90%'
          }
        }} 
      />
    );
  }
}

export class BreakEvenPointChart extends React.Component<IProps, {}> {
  render() {
    return (
      <Chart
        chartType="LineChart"
        width="100%"
        height="460px"
        loader={<LoadingPanel color="background" />}
        data={this.props.data}
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
    );
  }
}

export class YearlyGoalBurnUp extends React.Component<IProps & IYear, {}> {
  render() {
    return (
      <Chart
        chartType="LineChart"
        width="100%"
        height="460px"
        loader={<LoadingPanel color="background" />}
        data={this.props.data}
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
    );
  }
}
