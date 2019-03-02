export interface IIncome {
  [year: string]: {
    [month: string]: {
      [institution: string]: number
    }
  }
}

export interface ISavings {
  [year: string]: {
    [month: string]: {
      [institution: string]: {
        [type: string]: number
      }
    }
  }
}