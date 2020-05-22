export interface IChart {
  label: string;
  tooltip: string;
  URL: string;
}

export interface IMapppingCharts {
  [key: string]: IChart;
}

const CHARTS: IMapppingCharts = Object.freeze({
  INCOME_VS_SAVINGS: {
    label: 'Inc. vs Savings',
    tooltip: 'Income vs Savings',
    URL: 'income-vs-savings',
  },
  NET_WORTH_VS_SAVINGS: {
    label: 'NW vs Savings',
    tooltip: 'Net worth vs Savings',
    URL: 'net-worth-vs-savings',
  },
  SAVINGS_BREAKDOWN: {
    label: 'Savings break.',
    tooltip: 'Savings breakdown',
    URL: 'savings-breakdown',
  },
  SAVINGS_ALLOCATION_EVOLUTION: {
    label: 'Savings Alloc.',
    tooltip: 'Savings Allocation',
    URL: 'savings-allocation-evolution',
  },
  BREAK_EVEN_POINT: {
    label: 'Break-even P.',
    tooltip: 'Break-even point',
    URL: 'break-even-point',
  },
  YEARLY_GOAL_BURNUP: {
    label: 'Yearly burnup',
    tooltip: 'Yearly burnup',
    URL: 'yearly-goal-burnup',
  },
  PROJECTION: {
    label: 'Projection',
    tooltip: 'Projection',
    URL: 'projection',
  },
  EXPENSES_ALLOCATION_EVOLUTION: {
    label: 'Expenses Alloc.',
    tooltip: 'Expenses allocation',
    URL: 'expenses-allocation-evolution',
  },
});

export default CHARTS;
