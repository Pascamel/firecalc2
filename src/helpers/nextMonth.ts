const nextMonth = (year: string, month: string) => {
  let m = parseInt(month);
  let y = parseInt(year);

  m += 1;
  if (m > 12) {
    m = 1;
    y++;
  }

  return { year: y.toString(), month: m.toString() };
};

export default nextMonth;
