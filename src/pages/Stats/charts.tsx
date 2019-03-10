import React from 'react';
import { Chart } from 'react-google-charts';
import LoadingPanel from '../../components/LoadingPanel';


interface IProps {
  data: any
}

export class IncomeVsSavingsChart extends React.Component<IProps, {}> {
  render () {
    return (
      <Chart
        chartType="LineChart"
        width="100%"
        height="460px"
        loader={<LoadingPanel />}
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
            width: '90%',
            height: '80%'
          }
        }}
      />
    );
  }
}

export class NetWorthChart extends React.Component<IProps, {}> {
  render () {
    return (
      <Chart 
        chartType="AreaChart"
        width="100%"
        height="460px"
        loader={<LoadingPanel />}
        data={this.props.data}
        options={{
          legend: 'none',
          vAxis: { 
            format: 'short',
            viewWindow: {
              min: 0
            }
          },
          chartArea: {
            width: '90%', 
            height: '90%'
          }
        }}
      />
    );
  }
}

export class TotalSavingsChart extends React.Component<IProps, {}> {
  render () {
    return (
      <Chart 
        chartType="AreaChart"
        width="100%"
        height="460px"
        loader={<LoadingPanel />}
        data={this.props.data}
        legendToggle
        options={{
          legend: 'none',
          vAxis: { 
            format: 'short',
            viewWindow: {
              min: 0
            }
          },
          chartArea: {
            width: '90%', 
            height: '90%'
          }
        }}
      />
    );
  }
}

export class SavingsBreakdownChart extends React.Component<IProps, {}> {
  render () {
    return (
      <Chart
        chartType="PieChart"
        width="100%"
        height="460px"
        loader={<LoadingPanel />}
        data={this.props.data}
        options={{
          legend: {
            position: 'labeled',
          },
          pieSliceText: 'value', //'label',
          pieStartAngle: 100,
          chartArea: {
            width: '100%', 
            height: '90%'
          }
        }}
      />
    );
  }
}
