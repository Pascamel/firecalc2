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
  last?: boolean;
}

export interface IIncomeYearHeaders {
  collapsed: {
    [year: string]: boolean
  }
};

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

export interface ISavingsYearHeaders {
  collapsed: {
    [year: string]: boolean
  }, 
  goals: {
    [year: string]: number
  }
};

export interface ISavingsHeaderLight {
  id: string, 
  type: string, 
  types: string[]
};

export interface IBankYearAmount {
  [year: string]: number
}

export interface IBankYearMonthAmount {
  [year: string]: {
    [month: string]: number
  }
}

export interface IBankYearMonthString {
  [year: string]: {
    [month: string]: string
  }
}

export interface IBankYearInstitutionAmount {
  [year: string]: {
    [institution: string]: number
  }
}

export interface IBankYearInstitutionTypeAmount {
  [year: string]: {
    [institution: string]: {
      [type: string]: number
    }
  }
}

export interface IBankInstitutionTypeBoolean {
  [institution: string]: {
    [type: string]: boolean
  }
}

export interface IBankInstitutionTypeNumber {
  [institution: string]: {
    [type: string]: number
  }
}

export interface IBankYearMonthInstitutionAmount {
  [year: string]: {
    [month: string]: {
      [institution: string]: number
    }
  }
}
