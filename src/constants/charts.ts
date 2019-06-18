export const INCOME_VS_SAVINGS = 1;
export const NET_WORTH_VS_SAVINGS = 2;
export const SAVINGS_BREAKDOWN = 3;
export const ALLOCATION_EVOLUTION = 4;
export const BREAK_EVEN_POINT = 5;
export const YEARLY_GOAL_BURNUP = 6;
export const PROJECTION = 7;

interface IMapping {
  [key: string]: string;
} 

export const LABELS: IMapping = {
  INCOME_VS_SAVINGS: 'Income vs Savings',
  NET_WORTH_VS_SAVINGS: 'Net Worth vs Savings',
  SAVINGS_BREAKDOWN: 'Savings breakdown',
  ALLOCATION_EVOLUTION: 'Savings Allocation',
  BREAK_EVEN_POINT: 'Break-even point',
  YEARLY_GOAL_BURNUP: 'Yearly burnup',
  PROJECTION: 'Projection'
};

export const URL: IMapping = {
  INCOME_VS_SAVINGS: 'income-vs-savings',
  NET_WORTH_VS_SAVINGS: 'net-worth-vs-savings',
  SAVINGS_BREAKDOWN: 'savings-breakdown',
  ALLOCATION_EVOLUTION: 'allocation-evolution',
  BREAK_EVEN_POINT: 'break-even-point',
  YEARLY_GOAL_BURNUP: 'yearly-goal-burnup',
  PROJECTION: 'projection'
};
