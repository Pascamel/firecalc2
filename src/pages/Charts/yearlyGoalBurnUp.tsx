import React from 'react';
import { CartesianGrid, Legend, Line, LineChart, Tooltip, XAxis, YAxis } from 'recharts';

import Helpers from './helpers';
import { IProps, IYearlyGoalBurnUpChartData as IInterface } from './interfaces';
import ResponsiveWrapper from './responsiveWrapper';

export interface IYearlyGoalBurnUpChartData extends IInterface {}

const YearlyGoalBurnUp = (props: IProps<IInterface[]>) => (
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
      <Tooltip
        labelFormatter={Helpers.reactTextToDateString}
        formatter={Helpers.formatterTooltip}
      />
      <Legend formatter={Helpers.formatLegend} />
      <Line
        type="monotone"
        dataKey="done"
        stroke="#8884d8"
        dot={false}
        activeDot={{ r: 1 }}
      />
      <Line
        type="monotone"
        dataKey="goal"
        stroke="#82ca9d"
        dot={false}
        activeDot={{ r: 1 }}
      />
    </LineChart>
  </ResponsiveWrapper>
);

export default YearlyGoalBurnUp;
