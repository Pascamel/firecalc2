export interface IIncome {
  [year: string]: {
    [month: string]: {
      [institution: string]: number
    }
  }
}

export interface IIncomeHeader {

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

export interface ISavingsHeader {
  id: string,
  interest: boolean,
  type: string,
  types: string[]
}
