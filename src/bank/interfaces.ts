export interface IIncome {
  [year: string]: {
    [month: string]: {
      [institution: string]: number
    }
  }
}

export interface IIncomeHeader {
  id: string;
  label: string;
  pretax: boolean;
  count: number;
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
  id: string;
  interest: boolean;
  label: string;
  sublabel: string;
  icon: string;
  type: string;
  types: string[];
}
