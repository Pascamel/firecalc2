import * as React from 'react';
import { Button } from 'reactstrap';
import { Link } from 'react-router-dom';
import * as ROUTES from '../../constants/routes';
import PasswordForgetPage from './pwForgetPage';
// import { PasswordForgetForm } from './pwForgetForm';


export const PasswordForgetButton = () => (
  <Button block color="light" tag={Link} to={ROUTES.PASSWORD_FORGET}>
    Forgot Password?
  </Button>
);

export default PasswordForgetPage;
// export class PasswordForgetPage extends React.Component<{}, {}> {
//   render () {
//     return (
//       <div>
//         <PasswordForgetForm />
//       </div>
//     );
//   }
// }
