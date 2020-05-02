import React from 'react';
import { CartesianGrid, Legend, Line, LineChart, Tooltip, XAxis, YAxis } from 'recharts';

import Helpers from './helpers';
import { IProjectionChartData, IProps } from './interfaces';
import ResponsiveWrapper from './responsiveWrapper';

const ProjectionChart = ({ data }: IProps<IProjectionChartData[]>) => (
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
      <Tooltip labelFormatter={Helpers.reactTextToDateString} />
      <Legend formatter={Helpers.formatLegend} />
      <Line
        type="monotone"
        dataKey="projection5"
        stroke="#8884d8"
        dot={false}
        activeDot={{ r: 1 }}
      />
      <Line
        type="monotone"
        dataKey="projection7"
        stroke="#82ca9d"
        dot={false}
        activeDot={{ r: 1 }}
      />
    </LineChart>
  </ResponsiveWrapper>
);

export default ProjectionChart;
