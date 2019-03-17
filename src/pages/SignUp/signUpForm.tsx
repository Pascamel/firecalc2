import * as React from 'react';
import * as ROUTES from '../../constants/routes';
import * as ROLES from '../../constants/roles';
import { auth, firestore } from '../../firebase';
import { FormGroup, Input, Button } from 'reactstrap';


interface IProps {
  email?: string;
  error?: any;
  history?: any;
  passwordOne?: string;
  passwordTwo?: string;
}

interface IState {
  email: string;
  error: any;
  passwordOne: string;
  passwordTwo: string;
}

export class SignUpForm extends React.Component<IProps, IState> {
  private static INITIAL_STATE = {
    email: '',
    error: null,
    passwordOne: '',
    passwordTwo: '',
  };

  private static propKey(propertyName: string, value: any): object {
    return { [propertyName]: value };
  }

  constructor(props: IProps) {
    super(props);
    this.state = { ...SignUpForm.INITIAL_STATE };
  }

  public onSubmit(event: any) {
    event.preventDefault();

    const { email, passwordOne } = this.state;
    const { history } = this.props;

    auth.doCreateUserWithEmailAndPassword(email, passwordOne).then((authUser: any) => {
      return firestore.setUser(authUser.user.uid, {
        email,
        type: ROLES.USER
      });
    }).then(() => {
      this.setState(() => ({ ...SignUpForm.INITIAL_STATE }));
      history.push(ROUTES.HOME);
    })
    .catch(error => {
      this.setState(SignUpForm.propKey('error', error));
    });
  }

  public render() {
    const { email, passwordOne, passwordTwo, error } = this.state;
    const isInvalid =passwordOne !== passwordTwo || passwordOne === '' || email === '';

    return (
      <form onSubmit={(event) => this.onSubmit(event)}>
        <FormGroup className="mt-2">
          <Input
            value={email}
            onChange={event => this.setStateWithEvent(event, "email")}
            type="text"
            placeholder="Email Address"
          />
        </FormGroup>
        <FormGroup>
          <Input
            value={passwordOne}
            onChange={event => this.setStateWithEvent(event, "passwordOne")}
            type="password"
            placeholder="Password"
          />
        </FormGroup>
        <FormGroup>
          <Input
            value={passwordTwo}
            onChange={event => this.setStateWithEvent(event, "passwordTwo")}
            type="password"
            placeholder="Confirm Password"
          />
        </FormGroup>
        <FormGroup>
          <Button block color="primary" disabled={isInvalid} type="submit">
            Sign Up
          </Button>
        </FormGroup>

        {error && <p>{error.message}</p>}
      </form>
    );
  }

  private setStateWithEvent(event: any, columnType: string) {
    this.setState(SignUpForm.propKey(columnType, (event.target as any).value));
  }
}
