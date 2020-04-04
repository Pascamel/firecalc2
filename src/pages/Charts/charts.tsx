import moment from 'moment';
import React from 'react';
import {
    Area, AreaChart, CartesianGrid, Cell, LabelList, Legend, Line, LineChart, Pie, PieChart,
    ResponsiveContainer, Tooltip, XAxis, YAxis
} from 'recharts';

import { amount, deepCopy, roundFloat, roundUpClosestTen } from '../../helpers';
import {
    IAllocationEvolutionChart, IBreakEvenPointChartData, IIncomeVsSavingsChartData,
    INetWorthVsSavingsChartData, IProjectionChartData, ISavingsBreakdownChartData,
    IYearlyGoalBurnUpChartData
} from './interfaces';

interface IProps<T> {
  data: T;
  mobile: boolean;
  darkMode: boolean;
}

interface IPercentageProps {
  percentage: boolean;
}

const landscapeSize = {
  width: 650,
  height: 300
};

const squareSize = {
  width: 400,
  height: 400
};

const colors = ['#83c3f7', '#4791db', '#f28933', '#ffdd72', '#6a7b83'];

const formatdateToString = (d: Date) => moment(d).format('MMM Do YY');

const reactTextToDateString = (d: React.ReactText) =>
  formatdateToString(new Date(parseInt(d as string)));

const formatterTooltip = (v: string | number | React.ReactText[]) =>
  amount(v as number, true, true);

const toTitleCase = (str: string) =>
  str.replace(
    /\w*/g,
    (txt: string) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
  );

const formatLegend = (value: string | number | React.ReactText[]) =>
  toTitleCase(value as string);

const ResponsiveWrapper = (props: { children: JSX.Element }) => {
  return (
    <div style={{ height: '100%', width: '100%' }}>
      <ResponsiveContainer min-width="500" width={'100%'} height={'100%'}>
        {props.children}
      </ResponsiveContainer>
    </div>
  );
};

export const IncomeVsSavingsChart = (
  props: IProps<IIncomeVsSavingsChartData[]>
) => (
  <ResponsiveWrapper>
    <LineChart {...landscapeSize} data={props.data}>
      <CartesianGrid vertical={false} strokeDasharray="3 3" />
      <XAxis
        dataKey="date"
        type="number"
        domain={['dataMin', 'dataMax']}
        tickFormatter={formatdateToString}
      />
      <YAxis />
      <Tooltip labelFormatter={reactTextToDateString} />
      <Legend formatter={formatLegend} />
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

export const NetWorthVsSavingsChart = (
  props: IProps<INetWorthVsSavingsChartData[]> & IPercentageProps
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
                : null
          };
        })
      : data;

    const maxValue = roundUpClosestTen(
      Math.max(
        ...d.map(v =>
          Math.max(Math.abs(v.netWorth || 0), Math.abs(v.savings || 0))
        )
      )
    );

    const gradientOffset = () => {
      const dataMax = Math.max(...d.map(i => i.netWorth || 0));
      const dataMin = Math.min(...d.map(i => i.netWorth || 0));

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
          {...landscapeSize}
          data={d}
          margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
        >
          <CartesianGrid vertical={false} strokeDasharray="3 3" />
          <XAxis
            dataKey="date"
            type="number"
            domain={['dataMin', 'dataMax']}
            tickFormatter={formatdateToString}
          />
          <YAxis domain={[-maxValue, +maxValue]} />
          <Tooltip
            labelFormatter={s => formatdateToString(new Date(s))}
            formatter={value => `${value}%`}
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
      <LineChart {...landscapeSize} data={data}>
        <CartesianGrid vertical={false} strokeDasharray="3 3" />
        <XAxis
          dataKey="date"
          type="number"
          domain={['dataMin', 'dataMax']}
          tickFormatter={formatdateToString}
        />
        <YAxis />
        <Tooltip
          labelFormatter={reactTextToDateString}
          formatter={formatterTooltip}
        />
        <Legend formatter={formatLegend} />
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

export const SavingsBreakdownChart = (
  props: IProps<ISavingsBreakdownChartData[]>
) => {
  return (
    <ResponsiveWrapper>
      <PieChart {...squareSize}>
        <Pie
          dataKey="value"
          data={props.data}
          fill="#8884d8"
          isAnimationActive={false}
          label={value => value.name}
        >
          <LabelList dataKey="name" />
          {props.data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
          ))}
        </Pie>
        <Tooltip
          labelFormatter={reactTextToDateString}
          formatter={formatterTooltip}
        />
        <Legend formatter={formatLegend} />
      </PieChart>
    </ResponsiveWrapper>
  );
};

export const AllocationEvolutionChart = ({
  data,
  percentage
}: IProps<IAllocationEvolutionChart[]> & IPercentageProps) => {
  const d: IAllocationEvolutionChart[] = percentage
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
          allocation: alloc
        };
      })
    : data;

  return (
    <ResponsiveWrapper>
      <AreaChart
        {...landscapeSize}
        data={d.map(v => ({ date: v.date, ...v.allocation }))}
      >
        <CartesianGrid vertical={false} strokeDasharray="3 3" />
        <XAxis
          dataKey="date"
          type="number"
          domain={['dataMin', 'dataMax']}
          tickFormatter={formatdateToString}
        />
        <YAxis
          domain={percentage ? [0, 100] : [0, 'auto']}
          // allowDecimals={false}
          allowDataOverflow={true}
        />
        <Tooltip
          labelFormatter={reactTextToDateString}
          formatter={formatterTooltip}
        />
        <Legend formatter={formatLegend} />
        {Object.keys(d[0].allocation || {}).map((key, index) => (
          <Area
            type="monotone"
            key={key}
            dataKey={key}
            stackId="1"
            stroke={colors[index % colors.length]}
            fill={colors[index % colors.length]}
          />
        ))}
      </AreaChart>
    </ResponsiveWrapper>
  );
};

export const BreakEvenPointChart = (
  props: IProps<IBreakEvenPointChartData[]>
) => (
  <ResponsiveWrapper>
    <LineChart {...landscapeSize} data={props.data}>
      <CartesianGrid vertical={false} strokeDasharray="3 3" />
      <XAxis
        dataKey="date"
        type="number"
        domain={['dataMin', 'dataMax']}
        tickFormatter={formatdateToString}
      />
      <YAxis />
      <Tooltip
        labelFormatter={reactTextToDateString}
        formatter={formatterTooltip}
      />
      <Legend formatter={formatLegend} />
      <Line
        type="monotone"
        dataKey="income"
        stroke="#8884d8"
        dot={false}
        activeDot={{ r: 1 }}
      />
      <Line
        type="monotone"
        dataKey="expenses"
        stroke="#82ca9d"
        dot={false}
        activeDot={{ r: 1 }}
      />
    </LineChart>
  </ResponsiveWrapper>
);

export const YearlyGoalBurnUp = (
  props: IProps<IYearlyGoalBurnUpChartData[]>
) => (
  <ResponsiveWrapper>
    <LineChart {...landscapeSize} data={props.data}>
      <CartesianGrid vertical={false} strokeDasharray="3 3" />
      <XAxis
        dataKey="date"
        type="number"
        domain={['dataMin', 'dataMax']}
        tickFormatter={formatdateToString}
      />
      <YAxis />
      <Tooltip
        labelFormatter={reactTextToDateString}
        formatter={formatterTooltip}
      />
      <Legend formatter={formatLegend} />
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

export const ProjectionChart = (props: IProps<IProjectionChartData[]>) => (
  <ResponsiveWrapper>
    <LineChart {...landscapeSize} data={props.data}>
      <CartesianGrid vertical={false} strokeDasharray="3 3" />
      <XAxis
        dataKey="date"
        type="number"
        domain={['dataMin', 'dataMax']}
        tickFormatter={formatdateToString}
      />
      <YAxis />
      <Tooltip labelFormatter={reactTextToDateString} />
      <Legend formatter={formatLegend} />
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
