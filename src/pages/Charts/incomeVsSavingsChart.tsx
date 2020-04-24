import React from 'react';
import { CartesianGrid, Legend, Line, LineChart, Tooltip, XAxis, YAxis } from 'recharts';

import Helpers from './helpers';
import { IIncomeVsSavingsChartData as IInterface, IProps } from './interfaces';
import ResponsiveWrapper from './responsiveWrapper';

export interface IIncomeVsSavingsChartData extends IInterface {}

const IncomeVsSavingsChart = (props: IProps<IInterface[]>) => (
  <ResponsiveWrapper>
    <LineChart {...Helpers.landscapeSize} data={props.data}>
      <CartesianGrid vertical={false} strokeDasharray="3 3" />
      <XAxis
        dataKey="date"
        type="number"
        domain={['dataMin', 'dataMax']}
        tickFormatter={Helpers.formatDateAxis}
      />
      <YAxis tickFormatter={Helpers.formatAmountAxis} />
      Axis />
      <Tooltip labelFormatter={Helpers.reactTextToDateString} />
      <Legend formatter={Helpers.formatLegend} />
      <Line
        type="monotone"
        dataKey="income"
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

export default IncomeVsSavingsChart;
