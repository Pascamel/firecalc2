import * as React from 'react';
import { Form, Input, Button } from 'reactstrap';
import { auth } from '../../firebase';
import FormGroup from 'reactstrap/lib/FormGroup';


interface IState {
  email?: string;
  error?: any;
}
export class PasswordForgetForm extends React.Component<{}, IState> {
  private static INITIAL_STATE = {
    email: '',
    error: null
  };

  private static propKey(propertyName: string, value: string) {
    return { [propertyName]: value };
  }

  constructor(props: any) {
    super(props);

    this.state = { ...PasswordForgetForm.INITIAL_STATE };
  }

  public onSubmit = (event: any) => {
    if (!this.state.email) return;

    auth.doPasswordReset(this.state.email).then(() => {
      this.setState(() => ({ ...PasswordForgetForm.INITIAL_STATE }));
    }).catch(error => {
      this.setState(PasswordForgetForm.propKey('error', error));
    });

    event.preventDefault();
  };

  public render() {
    const { email, error }: any = this.state;
    const isInvalid = email === '';

    return (
      <React.Fragment>
        <Form onSubmit={(event) => this.onSubmit(event)}>
          <FormGroup>
            <Input
              className="mb-2 mr-sm-2 mb-sm-0"
              type="text"
              placeholder="Email Address"
              value={email}
              onChange={(event) => this.setStateWithEvent(event, 'email')}
            />
          </FormGroup>
          <FormGroup>
            <Button block disabled={isInvalid} type="submit" color="primary">
              Reset My Password
            </Button>
          </FormGroup>
        </Form>

        {error && <p>{error.message}</p>}
      </React.Fragment>
    );
  }

  private setStateWithEvent(event: any, columnType: string): void {
    this.setState(
      PasswordForgetForm.propKey(columnType, (event.target as any).value)
    );
  }
}