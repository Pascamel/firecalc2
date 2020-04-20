import React from 'react';
import { Cell, LabelList, Legend, Pie, PieChart, Tooltip } from 'recharts';

import Helpers from './helpers';
import { IProps, ISavingsBreakdownChartData } from './interfaces';
import ResponsiveWrapper from './responsiveWrapper';

const SavingsBreakdownChart = (props: IProps<ISavingsBreakdownChartData[]>) => {
  return (
    <ResponsiveWrapper>
      <PieChart {...Helpers.squareSize}>
        <Pie
          dataKey="value"
          data={props.data}
          fill="#8884d8"
          isAnimationActive={false}
          label={(value) => value.name}
        >
          <LabelList dataKey="name" />
          {props.data.map((entry, index) => (
            <Cell
              key={`cell-${index}`}
              fill={Helpers.colors[index % Helpers.colors.length]}
            />
          ))}
        </Pie>
        <Tooltip
          labelFormatter={Helpers.reactTextToDateString}
          formatter={Helpers.formatterTooltip}
        />
        <Legend formatter={Helpers.formatLegend} />
      </PieChart>
    </ResponsiveWrapper>
  );
};

export default SavingsBreakdownChart;
