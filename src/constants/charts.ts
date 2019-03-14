export const INCOME_VS_SAVINGS = 1;
export const NET_WORTH = 2;
export const TOTAL_SAVINGS = 3;
export const SAVINGS_BREAKDOWN = 4;


interface IMapping {
  [key: string]: string;
} 

export const LABELS: IMapping = {
  INCOME_VS_SAVINGS: 'Income vs Savings',
  NET_WORTH: 'Net worth',
  TOTAL_SAVINGS: 'Total savings',
  SAVINGS_BREAKDOWN: 'Savings breakdown'
};

export const URL: IMapping = {
  INCOME_VS_SAVINGS: 'income-vs-savings',
  NET_WORTH: 'net-worth',
  TOTAL_SAVINGS : 'total-savings',
  SAVINGS_BREAKDOWN: 'savings-breakdown'  
};
