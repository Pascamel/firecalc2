import React from 'react';
import { Chart } from 'react-google-charts';

import { LoadingPanel } from '../../components';
import { IArrayDateNumber, IYearlyArrayDateNumberNull, IYearlyChartData } from './interfaces';

interface IProps {
  data:   IArrayDateNumber | IYearlyArrayDateNumberNull | IYearlyChartData;
  mobile: boolean;
}

interface IYear {
  year: number;
}

export const IncomeVsSavingsChart = (props: IProps) => (
  <Chart
    chartType="LineChart"
    width="100%"
    height="460px"
    loader={<LoadingPanel color="background" />}
    data={props.data}
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
        width: props.mobile ? '82%' : '93%',
        right: props.mobile ? '5%' : '2%',
        height: '80%'
      }
    }}
  />
);

export const NetWorthVsSavingsChart = (props: IProps) => (
  <Chart
    chartType="LineChart"
    width="100%"
    height="460px"
    loader={<LoadingPanel color="background" />}
    data={props.data}
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
        width: props.mobile ? '80%' : '92%', 
        right: props.mobile ? '5%' : '2%',
        height: '80%'
      }
    }}
  />
);

export const SavingsBreakdownChart = (props: IProps) => (
  <Chart
    chartType="PieChart"
    width="100%"
    height="460px"
    loader={<LoadingPanel color="background" />}
    data={props.data}
    options={{
      legend: {
        position: props.mobile ? 'bottom' : 'labeled',
      },
      pieSliceText: 'value',
      pieStartAngle: 100,
      chartArea: {
        width: props.mobile ? '90%' : '96%', 
        height: '90%'
      }
    }}
  />
);

export const AllocationEvolutionChart = (props: IProps) => (
  <Chart 
    chartType="AreaChart"
    width="100%"
    height="460px"
    loader={<LoadingPanel color="background" />}
    data={props.data}
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
        width: props.mobile ? '80%' : '92%', 
        right: props.mobile ? '5%' : '2%',
        height: '90%'
      }
    }} 
  />
);

export const BreakEvenPointChart = (props: IProps) => (
  <Chart
    chartType="LineChart"
    width="100%"
    height="460px"
    loader={<LoadingPanel color="background" />}
    data={props.data}
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
        width: props.mobile ? '80%' : '92%', 
        right: props.mobile ? '5%' : '2%',
        height: '80%'
      }
    }}
  />
);

export const YearlyGoalBurnUp = (props: IProps & IYear) => (
  <Chart
    chartType="LineChart"
    width="100%"
    height="460px"
    loader={<LoadingPanel color="background" />}
    data={props.data}
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
        width: props.mobile ? '80%' : '92%', 
        right: props.mobile ? '5%' : '2%',
        height: '80%'
      }
    }}
  />
);
