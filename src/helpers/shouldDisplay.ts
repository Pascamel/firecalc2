import { ISavingsHeader } from '../bank';

const _trueAndValid = (
  flag: boolean,
  month: number | null,
  year: number | null
) => {
  const m = month || 0,
    y = year || 0,
    result = flag && m > 0 && m < 13 && y > 1999 && y < 2099;

  return { result, m, y };
};

const shouldDisplay = (object: ISavingsHeader, month: number, year: number) => {
  const { result: from, m: fromMonth, y: fromYear } = _trueAndValid(
      object.displayFrom,
      object.displayFromMonth,
      object.displayFromYear
    ),
    { result: to, m: toMonth, y: toYear } = _trueAndValid(
      object.displayTo,
      object.displayToMonth,
      object.displayToYear
    ),
    f = !from || year > fromYear || (year === fromYear && month >= fromMonth),
    t = !to || year < toYear || (year === toYear && month <= toMonth);

  return f && t;
};

export default shouldDisplay;
