export type IArrayDateNumber = Array<Array<string> | Array<Date|number> | Array<string|{v: number, f: string}>>;
export type IArrayDateNumberNull = Array<Array<string> | Array<Date|number|null>>;

export type IYearlyArrayDateNumber = {
  [year:number]: Array<Array<string> | Array<Date|number> | Array<string|{v: number, f: string}>>;
};

export type IYearlyArrayDateNumberNull = {
  [year:number]: Array<Array<string> | Array<Date|number|null>>
};

export type IYearlyChartData = Array<Array<string> | Array<Date|number|null> | Array<Date|number> | Array<string|{v: number, f: string}>>;