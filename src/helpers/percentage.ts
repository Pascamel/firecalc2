const percentage = (
  number: number,
  decimals: number = 2,
  plusSign: boolean = false
) => {
  return (
    (plusSign && number >= 0 ? '+' : '') +
    Number(100 * number).toFixed(decimals) +
    '%'
  );
};

export default percentage;
