const joinFilter = (...strings: Array<string | null | undefined>) => {
  return strings
    .filter((v) => v !== null)
    .filter((v) => v !== undefined)
    .filter((v) => v !== '')
    .join(' ');
};

export default joinFilter;
