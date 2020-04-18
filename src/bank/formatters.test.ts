import * as formatters from './formatters';

it('formats labels for Savings headers', () => {
  expect(formatters.labelSavings('P')).toEqual('Principal');
  expect(formatters.labelSavings('I')).toEqual('Interest');
  expect(formatters.labelSavings('T')).toEqual('Total');
  expect(formatters.labelSavings(' ')).toEqual('N/A');
  expect(formatters.labelSavings('')).toEqual('N/A');
});
