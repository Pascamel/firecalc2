export type IChartAllocationData = {
  [key: string]: number | null
}

export type IChartData = { 
  date: number,
  savings?: number | null,
  income?: number | null,
  netWorth?: number | null,
  expenses?: number | null,
  goal?: number | null,
  done?: number | null,  
  projection5?: number | null,
  projection7?: number | null,
  allocation?: IChartAllocationData,
}

export type IPieChartData = {
  name: string,
  value: number | null,
}
