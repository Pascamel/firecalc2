import * as React from 'react';
import * as ROUTES from '../../constants/routes';
import { auth } from '../../firebase';
import { FormGroup, Input, InputGroup, InputGroupAddon, InputGroupText, Button } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

interface InterfaceProps {
  email?: string;
  error?: any;
  history?: any;
  password?: string;
}

interface InterfaceState {
  email: string;
  error: any;
  password: string;
}

export class SignInForm extends React.Component<InterfaceProps,InterfaceState> {
  private static INITIAL_STATE = {
    email: '',
    error: null,
    password: ''
  };

  private static propKey(propertyName: string, value: any): object {
    return { [propertyName]: value };
  }

  constructor(props: InterfaceProps) {
    super(props);

    this.state = { ...SignInForm.INITIAL_STATE };
  }

  public onSubmit = (event: any) => {
    const { email, password } = this.state;
    const { history } = this.props;

    auth.doSignInWithEmailAndPassword(email, password).then(() => {
      this.setState(() => ({ ...SignInForm.INITIAL_STATE }));
      history.push(ROUTES.HOME);
    }).catch(error => {
      this.setState(SignInForm.propKey('error', error));
    });

    event.preventDefault();
  };

  public render() {
    const { email, password, error } = this.state;

    const isInvalid = password === '' || email === '';

    return (
      <form onSubmit={event => this.onSubmit(event)}>
        <FormGroup>
          <InputGroup className="mt-2">
            <InputGroupAddon addonType="prepend">
              <InputGroupText>
                <FontAwesomeIcon icon={['far', 'user']} />
              </InputGroupText>
            </InputGroupAddon>
            <Input
              value={email}
              onChange={event => this.setStateWithEvent(event, 'email')}
              type="text"
              placeholder="Email Address" 
            />
          </InputGroup>
        </FormGroup>
        <FormGroup>
          <InputGroup>
            <InputGroupAddon addonType="prepend">
              <InputGroupText>
                <FontAwesomeIcon icon="unlock-alt" />
              </InputGroupText>
            </InputGroupAddon>
            <Input
              value={password}
              onChange={event => this.setStateWithEvent(event, 'password')}
              type="password"
              placeholder="Password" 
            />
          </InputGroup>
        </FormGroup>
        <FormGroup>
          <Button color="primary" block={true} disabled={isInvalid} type="submit">
            Sign In
          </Button>
        </FormGroup>

        {error && <p>{error.message}</p>}
      </form>
    );
  }

  private setStateWithEvent(event: any, columnType: string): void {
    this.setState(SignInForm.propKey(columnType, (event.target as any).value));
  }
}
