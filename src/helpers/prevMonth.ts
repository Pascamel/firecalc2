const prevMonth = (year: string, month: string) => {
  let m = parseInt(month);
  let y = parseInt(year);

  m -= 1;
  if (m < 1) {
    m = 12;
    y--;
  }

  return { year: y.toString(), month: m.toString() };
};

export default prevMonth;
