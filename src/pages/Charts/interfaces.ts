export type IChartAllocationData = {
  [key: string]: number | null
}

export type IIncomeVsSavingsChartData = {
  date: number,
  savings: number | null,
  income: number | null,

}
export type INetWorthVsSavingsChartData = {
  date: number,
  savings: number | null,
  netWorth: number | null,
}

export type ISavingsBreakdownChartData = {
  name: string,
  value: number | null,
}

export type IAllocationEvolutionChart = {
  date: number,
  allocation: IChartAllocationData,
}

export type IBreakEvenPointChartData = {
  date: number,
  expenses: number | null,
}

export type IYearlyGoalBurnUpChartData = {
  date: number,
  goal: number | null,
  done: number | null,  
}

export type IProjectionChartData = { 
  date: number,
  projection5: number | null,
  projection7: number | null,
}

export type IChartData = IIncomeVsSavingsChartData | INetWorthVsSavingsChartData | 
//ISavingsBreakdownChartData |
  IAllocationEvolutionChart | IBreakEvenPointChartData | IYearlyGoalBurnUpChartData | IProjectionChartData;

