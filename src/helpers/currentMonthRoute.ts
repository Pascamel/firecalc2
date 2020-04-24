import ROUTES from '../constants/routes';

const currentMonthRoute = () => {
  return ROUTES.MONTH.replace(
    ':year',
    new Date().getFullYear().toString()
  ).replace(':month', (new Date().getMonth() + 1).toString());
};

export default currentMonthRoute;
