export const INCOME_VS_SAVINGS = 1;
export const NET_WORTH = 2;
export const TOTAL_SAVINGS = 3;
export const NET_WORTH_VS_SAVINGS = 4;
export const SAVINGS_BREAKDOWN = 5;
export const ALLOCATION_EVOLUTION = 6;
export const BREAK_EVEN_ANALYSIS = 7;

interface IMapping {
  [key: string]: string;
} 

export const LABELS: IMapping = {
  INCOME_VS_SAVINGS: 'Income vs Savings',
  NET_WORTH: 'Net worth',
  TOTAL_SAVINGS: 'Total savings',
  NET_WORTH_VS_SAVINGS: 'Net worth vs Savings',
  SAVINGS_BREAKDOWN: 'Savings breakdown',
  ALLOCATION_EVOLUTION: 'Allocation evolution',
  BREAK_EVEN_ANALYSIS: 'Break even analysis'
};

export const URL: IMapping = {
  INCOME_VS_SAVINGS: 'income-vs-savings',
  NET_WORTH: 'net-worth',
  TOTAL_SAVINGS : 'total-savings',
  NET_WORTH_VS_SAVINGS: 'net-worth-vs-savings',
  SAVINGS_BREAKDOWN: 'savings-breakdown',
  ALLOCATION_EVOLUTION: 'allocation-evolution',
  BREAK_EVEN_ANALYSIS: 'break-even-analysis'
};
