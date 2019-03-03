import moment from 'moment';

const amount = (number: number, display_if_zero: boolean, show_decimals: boolean) => {
  if ((!number || number === 0) && !display_if_zero) return '';

  return Number(number || 0).toLocaleString(
    undefined, { 
      minimumFractionDigits: show_decimals ? 2 : 0,
      maximumFractionDigits: show_decimals ? 2 : 0
    }
  );
};  

const percentage = (number: number) => {
  return Number(number).toFixed(2) + '%';     
};

const goal = (value: number, threshold: number, success: string, danger: string) => {
  success = success || 'table-success';
  danger = danger || 'table-danger';
  
  return (value >= threshold) ? success : danger;
};

const roundFloat = (num: number ) => {
  return Math.round((num + 0.00001) * 100) / 100;
};

const showIf = (bool: boolean, className: string|null) => {
  className = className || 'hidden';

  return bool ? '' : className;
};

const hideIf = (bool: boolean, className?: string) => {
  className = className || 'hidden';

  return bool ? className : '';
};

const labelMonth = (m: string) => {
  return moment().month(parseInt(m) - 1).format('MMMM');
}

export default {
  amount, 
  percentage,
  goal,
  roundFloat,
  showIf,
  hideIf,
  labelMonth
};
