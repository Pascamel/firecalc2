import React from 'react';
import {
    Area, AreaChart, CartesianGrid, Legend, Line, LineChart, Tooltip, XAxis, YAxis
} from 'recharts';

import { deepCopy, roundFloat, roundUpClosestTen } from '../../helpers';
import Helpers from './helpers';
import { INetWorthVsSavingsChartData as IInterface, IPercentageProps, IProps } from './interfaces';
import ResponsiveWrapper from './responsiveWrapper';

export interface INetWorthVsSavingsChartData extends IInterface {}

const NetWorthVsSavingsChart = (
  props: IProps<IInterface[]> & IPercentageProps
) => {
  const { data, percentage, darkMode } = props;

  if (percentage) {
    const d: INetWorthVsSavingsChartData[] = percentage
      ? deepCopy(data).map((month: INetWorthVsSavingsChartData) => {
          return {
            date: month.date,
            savings: 0,
            netWorth:
              month.netWorth && month.savings
                ? roundFloat(
                    ((month.netWorth - month.savings) * 100) / month.savings
                  )
                : null,
          };
        })
      : data;

    const maxValue = roundUpClosestTen(
      Math.max(
        ...d.map((v) =>
          Math.max(Math.abs(v.netWorth || 0), Math.abs(v.savings || 0))
        )
      )
    );

    const gradientOffset = () => {
      const dataMax = Math.max(...d.map((i) => i.netWorth || 0));
      const dataMin = Math.min(...d.map((i) => i.netWorth || 0));

      if (dataMax <= 0) {
        return 0;
      } else if (dataMin >= 0) {
        return 1;
      } else {
        return dataMax / (dataMax - dataMin);
      }
    };

    const off = gradientOffset();

    return (
      <ResponsiveWrapper>
        <AreaChart
          {...Helpers.landscapeSize}
          data={d}
          margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
        >
          <CartesianGrid vertical={false} strokeDasharray="3 3" />
          <XAxis
            dataKey="date"
            type="number"
            domain={['dataMin', 'dataMax']}
            tickFormatter={Helpers.formatDateAxis}
          />
          <YAxis domain={[-maxValue, +maxValue]} />
          <Tooltip
            labelFormatter={(s) => Helpers.formatDateAxis(new Date(s))}
            formatter={(value) => `${value}%`}
          />
          <defs>
            <linearGradient id="splitColor" x1="0" y1="0" x2="0" y2="1">
              <stop
                offset={off}
                stopColor={darkMode ? '#008958' : '#66bb6a'}
                stopOpacity={1}
              />
              <stop
                offset={off}
                stopColor={darkMode ? '#c12546' : '#e62154'}
                stopOpacity={1}
              />
            </linearGradient>
          </defs>
          <Area
            type="monotone"
            dataKey="netWorth"
            stroke="#000"
            fill="url(#splitColor)"
          />
        </AreaChart>
      </ResponsiveWrapper>
    );
  }

  return (
    <ResponsiveWrapper>
      <LineChart {...Helpers.landscapeSize} data={data}>
        <CartesianGrid vertical={false} strokeDasharray="3 3" />
        <XAxis
          dataKey="date"
          type="number"
          domain={['dataMin', 'dataMax']}
          tickFormatter={Helpers.formatDateAxis}
        />
        <YAxis tickFormatter={Helpers.formatAmountAxis} />
        <Tooltip
          labelFormatter={Helpers.reactTextToDateString}
          formatter={Helpers.formatterTooltip}
        />
        <Legend formatter={Helpers.formatLegend} />
        <Line
          type="monotone"
          dataKey="netWorth"
          stroke="#8884d8"
          dot={false}
          activeDot={{ r: 1 }}
        />
        <Line
          type="monotone"
          dataKey="savings"
          stroke="#82ca9d"
          dot={false}
          activeDot={{ r: 1 }}
        />
      </LineChart>
    </ResponsiveWrapper>
  );
};

export default NetWorthVsSavingsChart;
