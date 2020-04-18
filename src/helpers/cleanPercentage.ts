const cleanPercentage = (percentage: number) => {
  return Math.min(100, Math.max(0, 100 + 100 * percentage));
};

export default cleanPercentage;
