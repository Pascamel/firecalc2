export interface IBankHeaders {
  expenses: IExpenseHeader[];
  firstMonth: number;
  firstYear: number;
  incomes: IIncomeHeader[];
  last_update: number;
  savings: ISavingsHeader[];
  startingCapital: number;
}

export interface IIncome {
  [year: string]: {
    [month: string]: {
      [institution: string]: number;
    };
  };
}

export interface IIncomeDataModel {
  year: number;
  month: number;
  type: string;
  amount: number;
}

export interface IIncomeHeader {
  id: string;
  label: string;
  pretax: boolean;
  count: number;
  last?: boolean;
}

export interface IIncomeYearHeaders {
  collapsed: {
    [year: string]: boolean;
  };
}

export interface ISavings {
  [year: string]: {
    [month: string]: {
      [institution: string]: {
        [type: string]: number;
      };
    };
  };
}

export interface ISavingsDataModel {
  year: number;
  month: number;
  institution: string;
  type: string;
  amount: number;
}

export interface ISavingsHeader {
  id: string;
  interest: boolean;
  label: string;
  sublabel: string;
  icon: string;
  type: string;
  types: string[];
  displayFrom: boolean;
  displayFromMonth: number | null;
  displayFromYear: number | null;
  displayTo: boolean;
  displayToMonth: number | null;
  displayToYear: number | null;
}

export interface IExpenses {
  [year: string]: {
    [month: string]: {
      [type: string]: number;
    };
  };
}

export interface IExpenseDataModel {
  year: number;
  month: number;
  type: string;
  amount: number;
}

export interface IExpenseHeader {
  id: string;
  label: string;
  type: number;
  isNecessary: boolean;
  isFuture: boolean;
  startMonth: number | null;
  startYear: number | null;
  amount: number | null;
}

export interface ISavingsYearHeaders {
  collapsed: {
    [year: string]: boolean;
  };
  goals: {
    [year: string]: number;
  };
}

export interface ISavingsHeaderLight {
  id: string;
  type: string;
  types: string[];
}

export interface IBankYearAmount {
  [year: string]: number;
}

export interface IBankYearMonthAmount {
  [year: string]: {
    [month: string]: number;
  };
}

export interface IBankYearMonthString {
  [year: string]: {
    [month: string]: string;
  };
}

export interface IBankYearInstitutionAmount {
  [year: string]: {
    [institution: string]: number;
  };
}

export interface IBankYearInstitutionTypeAmount {
  [year: string]: {
    [institution: string]: {
      [type: string]: number;
    };
  };
}

export interface IBankInstitutionTypeBoolean {
  [institution: string]: {
    [type: string]: boolean;
  };
}

export interface IBankInstitutionTypeNumber {
  [institution: string]: {
    [type: string]: number;
  };
}

export interface IBankYearMonthInstitutionAmount {
  [year: string]: {
    [month: string]: {
      [institution: string]: number;
    };
  };
}
