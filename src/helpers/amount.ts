const amount = (
  number: number,
  display_if_zero: boolean,
  show_decimals: boolean
) => {
  if ((!number || number === 0) && !display_if_zero) return '';

  return Number(number || 0).toLocaleString(undefined, {
    minimumFractionDigits: show_decimals ? 2 : 0,
    maximumFractionDigits: show_decimals ? 2 : 0
  });
};

export default amount;
