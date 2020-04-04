const roundFloat = (num: number) => {
  return Math.round((num + 0.00001) * 100) / 100;
};

export default roundFloat;
