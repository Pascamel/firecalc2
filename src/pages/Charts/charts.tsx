import React from 'react';
import { Chart } from 'react-google-charts';

import { LoadingPanel } from '../../components';
import { IArrayDateNumber, IYearlyArrayDateNumberNull, IYearlyChartData } from './interfaces';

interface IProps {
  data:   IArrayDateNumber | IYearlyArrayDateNumberNull | IYearlyChartData;
  mobile: boolean;
  darkMode: boolean;
}

interface IYear {
  year: number;
}

const axisProperties = (props: IProps) => {
  return {
    baselineColor: props.darkMode ? '#777' : '#333',
    gridlines: {
      color: props.darkMode ? '#777' : '#333'
    },
    textStyle: {
      color: props.darkMode ? '#ccc' : '#333'
    }
  };
};

const backgroundColorProperty = (props: IProps) => {
  return {
    backgroundColor: props.darkMode ? '#1b1b1b' : '#fff'
  };
};

const legendTextProperty = (props: IProps) => {
  return {
    textStyle: { color: props.darkMode ? '#ccc' : '#333' }
  }; 
};

export const IncomeVsSavingsChart = (props: IProps) => (
  <Chart
    chartType="LineChart"
    width="100%"
    height="99%"
    loader={<LoadingPanel color="background" />}
    data={props.data}
    options={{
      legend: {
        ...legendTextProperty(props),
        position: 'top',
        alignment: 'start'
      },
      ...backgroundColorProperty(props),
      hAxis: {
        ...axisProperties(props),
        type: 'date'
      },
      vAxis: {
        ...axisProperties(props),
        format: 'short',
        viewWindow: {
          min: 0
        }
      },
      series: {
        0: {
          curveType: 'function'
        },
        1: {
          curveType: 'function'
        },
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
    height="99%"
    loader={<LoadingPanel color="background" />}
    data={props.data}
    options={{
      legend: {
        ...legendTextProperty(props),
        position: 'top',
        alignment: 'start'
      },
      ...backgroundColorProperty(props),
      hAxis: {
        ...axisProperties(props),
        type: 'date'
      },
      vAxis: {
        ...axisProperties(props),
        format: 'short'
      },
      series: {
        0: {
          curveType: 'function'
        },
        1: {
          curveType: 'function'
        },
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
    height="99%"
    loader={<LoadingPanel color="background" />}
    data={props.data}
    options={{
      legend: {
        ...legendTextProperty(props),
        position: props.mobile ? 'bottom' : 'labeled'
      },
      ...backgroundColorProperty(props),
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
    height="99%"
    loader={<LoadingPanel color="background" />}
    data={props.data}
    legendToggle
    options={{
      isStacked: true,
      legend: {
        ...legendTextProperty(props),
        position: 'top',
        alignment: 'start'
      },
      ...backgroundColorProperty(props),
      hAxis: {
        ...axisProperties(props),
        type: 'date'
      },
      vAxis: {
        ...axisProperties(props),
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
    height="99%"
    loader={<LoadingPanel color="background" />}
    data={props.data}
    options={{
      legend: {
        ...legendTextProperty(props),
        position: 'top',
        alignment: 'start'
      },
      ...backgroundColorProperty(props),
      hAxis: {
        ...axisProperties(props),
        type: 'date'
      },
      vAxis: {
        ...axisProperties(props),
        format: 'short'
      },
      series: {
        0: {
          curveType: 'function'
        },
        1: {
          curveType: 'function'
        },
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
    height="99%"
    loader={<LoadingPanel color="background" />}
    data={props.data}
    options={{
      legend: {
        ...legendTextProperty(props),
        position: 'top',
        alignment: 'start'
      },
      ...backgroundColorProperty(props),
      hAxis: {
        ...axisProperties(props),
        type: 'date'
      },
      vAxis: {
        ...axisProperties(props),
        format: 'short'
      },
      series: {
        0: {
          curveType: 'function'
        },
        1: {
          curveType: 'function'
        },
      },
      chartArea: {
        width: props.mobile ? '80%' : '92%', 
        right: props.mobile ? '5%' : '2%',
        height: '80%'
      }
    }}
  />
);
