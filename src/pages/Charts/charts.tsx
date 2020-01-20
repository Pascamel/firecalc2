import moment from 'moment';
import React from 'react';
import {
  Area,
  AreaChart,
  CartesianGrid,
  Cell,
  LabelList,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

import helpers from '../../helpers';
import {
  IAllocationEvolutionChart,
  IBreakEvenPointChartData,
  IIncomeVsSavingsChartData,
  INetWorthVsSavingsChartData,
  IProjectionChartData,
  ISavingsBreakdownChartData,
  IYearlyGoalBurnUpChartData
} from './interfaces';

interface IProps<T> {
  data:  T;
  mobile: boolean;
  darkMode: boolean;
}

const formatdateToString = (d: Date) => moment(d).format('MMM Do YY');

const formatReactTextDateToString = (d: React.ReactText) => formatdateToString(new Date(parseInt(d as string)));

const formatterValue = (v: string | number | React.ReactText[]) => helpers.amount(v as number, true, true);

const colors = [ '#83c3f7', '#4791db', '#f28933', '#ffdd72', '#6a7b83' ];

function toTitleCase(str: string) {
  return str.replace(/\w*/g, (txt: string) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase());
}

const formatLegend = (value: string | number | React.ReactText[]) => {
  return toTitleCase(value as string);
}

const ResponsiveWrapper = (props: {children: JSX.Element}) => {
  return (
    <div style={{height: '100%', width: '100%'}}>
      <ResponsiveContainer min-width="500" width={'100%'} height={'100%'}>
        {props.children}
      </ResponsiveContainer>
    </div>
  );
}

export const IncomeVsSavingsChart = (props: IProps<IIncomeVsSavingsChartData[]>) => (
  <ResponsiveWrapper>
    <LineChart width={650} height={300} data={props.data}>
      <CartesianGrid vertical={false} strokeDasharray="3 3" />
      <XAxis dataKey="date" type="number" domain = {['dataMin', 'dataMax']} tickFormatter={formatdateToString} />
      <YAxis />
      <Tooltip labelFormatter={formatReactTextDateToString} />
      <Legend formatter={formatLegend} />
      <Line type="monotone" dataKey="income" stroke="#8884d8" dot={false} activeDot={{ r: 1 }} />
      <Line type="monotone" dataKey="savings" stroke="#82ca9d" dot={false} activeDot={{ r: 1 }} />
    </LineChart>
  </ResponsiveWrapper>
);

export const NetWorthVsSavingsChart = (props: IProps<INetWorthVsSavingsChartData[]>) => (
  <ResponsiveWrapper>
    <LineChart width={650} height={300} data={props.data}>
      <CartesianGrid vertical={false} strokeDasharray="3 3" />
      <XAxis dataKey="date" type="number" domain = {['dataMin', 'dataMax']} tickFormatter={formatdateToString} />
      <YAxis />
      <Tooltip labelFormatter={formatReactTextDateToString} formatter={formatterValue} />
      <Legend formatter={formatLegend} />
      <Line type="monotone" dataKey="netWorth" stroke="#8884d8" dot={false} activeDot={{ r: 1 }} />
      <Line type="monotone" dataKey="savings" stroke="#82ca9d" dot={false} activeDot={{ r: 1 }} />
    </LineChart>
  </ResponsiveWrapper>
);

export const SavingsBreakdownChart = (props: IProps<ISavingsBreakdownChartData[]>) => (
  <ResponsiveWrapper>
    <PieChart width={400} height={400}>
      <Pie dataKey="value" data={props.data} fill="#8884d8" isAnimationActive={false} label={value => value.name}>
        <LabelList dataKey="name" />
        {props.data.map((entry, index) => (
          <Cell key={`cell-${index}`} fill={colors[index % colors.length]}/>
        ))}
      </Pie>
      <Tooltip labelFormatter={formatReactTextDateToString} formatter={formatterValue} />
      <Legend formatter={formatLegend} />
    </PieChart>
  </ResponsiveWrapper>
);

export const AllocationEvolutionChart = (props: IProps<IAllocationEvolutionChart[]>) => (
  <ResponsiveWrapper>
    <AreaChart width={650} height={300} data={props.data.map(v => ({date: v.date, ...v.allocation}))}>
      <CartesianGrid vertical={false} strokeDasharray="3 3" />
      <XAxis dataKey="date" type="number" domain = {['dataMin', 'dataMax']} tickFormatter={formatdateToString} />
      <YAxis />
      <Tooltip labelFormatter={formatReactTextDateToString} formatter={formatterValue} />
      <Legend formatter={formatLegend} />
      {Object.keys(props.data[0].allocation || {}).map((key, index) => (
        <Area type="monotone" key={key} dataKey={key} stackId="1" stroke={colors[index % colors.length]} fill={colors[index % colors.length]} />
      ))}
    </AreaChart>
  </ResponsiveWrapper>
);

export const BreakEvenPointChart = (props: IProps<IBreakEvenPointChartData[]>) => (
  <ResponsiveWrapper>
    <LineChart width={650} height={300} data={props.data}>
      <CartesianGrid vertical={false} strokeDasharray="3 3" />
      <XAxis dataKey="date" type="number" domain = {['dataMin', 'dataMax']} tickFormatter={formatdateToString} />
      <YAxis />
      <Tooltip labelFormatter={formatReactTextDateToString} formatter={formatterValue} />
      <Legend formatter={formatLegend} />
      <Line type="monotone" dataKey="income" stroke="#8884d8" dot={false} activeDot={{ r: 1 }} />
      <Line type="monotone" dataKey="expenses" stroke="#82ca9d" dot={false} activeDot={{ r: 1 }} />
    </LineChart>
  </ResponsiveWrapper>
);

export const YearlyGoalBurnUp = (props: IProps<IYearlyGoalBurnUpChartData[]>) => (
  <ResponsiveWrapper>
    <LineChart width={650} height={300} data={props.data}>
      <CartesianGrid vertical={false} strokeDasharray="3 3" />
      <XAxis dataKey="date" type="number" domain = {['dataMin', 'dataMax']} tickFormatter={formatdateToString} />
      <YAxis />
      <Tooltip labelFormatter={formatReactTextDateToString} formatter={formatterValue} />
      <Legend formatter={formatLegend} />
      <Line type="monotone" dataKey="done" stroke="#8884d8" dot={false} activeDot={{ r: 1 }} />
      <Line type="monotone" dataKey="goal" stroke="#82ca9d" dot={false} activeDot={{ r: 1 }} />
    </LineChart>
  </ResponsiveWrapper>
);

export const ProjectionChart = (props: IProps<IProjectionChartData[]>) => (
  <ResponsiveWrapper>
    <LineChart width={650} height={300} data={props.data}>
      <CartesianGrid vertical={false} strokeDasharray="3 3" />
      <XAxis dataKey="date" type="number" domain = {['dataMin', 'dataMax']} tickFormatter={formatdateToString} />
      <YAxis />
      <Tooltip labelFormatter={formatReactTextDateToString} />
      <Legend formatter={formatLegend} />
      <Line type="monotone" dataKey="projection5" stroke="#8884d8" dot={false} activeDot={{ r: 1 }} />
      <Line type="monotone" dataKey="projection7" stroke="#82ca9d" dot={false} activeDot={{ r: 1 }} />
    </LineChart>
  </ResponsiveWrapper>
);
