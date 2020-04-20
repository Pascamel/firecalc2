import React from 'react';
import { Area, AreaChart, CartesianGrid, Legend, Tooltip, XAxis, YAxis } from 'recharts';

import { deepCopy, roundFloat } from '../../helpers';
import Helpers from './helpers';
import { IAllocationEvolutionChart as IInterface, IPercentageProps, IProps } from './interfaces';
import ResponsiveWrapper from './responsiveWrapper';

export interface IAllocationEvolutionChart extends IInterface {}

const AllocationEvolutionChart = ({
  data,
  percentage,
}: IProps<IInterface[]> & IPercentageProps) => {
  const d: IInterface[] = percentage
    ? deepCopy(data).map((month: IAllocationEvolutionChart) => {
        const alloc = month.allocation;
        const sum = Object.values(alloc).reduce(
          (acc: number, v) => acc + (v || 0),
          0
        );
        for (const key in alloc) {
          if (alloc.hasOwnProperty(key)) {
            alloc[key] = roundFloat(((alloc[key] || 0) * 100) / sum);
          }
        }

        return {
          date: month.date,
          allocation: alloc,
        };
      })
    : data;

  return (
    <ResponsiveWrapper>
      <AreaChart
        {...Helpers.landscapeSize}
        data={d.map((v) => ({ date: v.date, ...v.allocation }))}
      >
        <CartesianGrid vertical={false} strokeDasharray="3 3" />
        <XAxis
          dataKey="date"
          type="number"
          domain={['dataMin', 'dataMax']}
          tickFormatter={Helpers.formatdateToString}
        />
        <YAxis
          domain={percentage ? [0, 100] : [0, 'auto']}
          allowDataOverflow={true}
        />
        <Tooltip
          labelFormatter={Helpers.reactTextToDateString}
          formatter={Helpers.formatterTooltip}
        />
        <Legend formatter={Helpers.formatLegend} />
        {Object.keys(d[0].allocation || {}).map((key, index) => (
          <Area
            type="monotone"
            key={key}
            dataKey={key}
            stackId="1"
            stroke={Helpers.colors[index % Helpers.colors.length]}
            fill={Helpers.colors[index % Helpers.colors.length]}
          />
        ))}
      </AreaChart>
    </ResponsiveWrapper>
  );
};

export default AllocationEvolutionChart;
