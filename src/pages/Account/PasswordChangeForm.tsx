import * as React from 'react';
import { Button, Form, Input } from 'reactstrap';

import { auth } from '../../firebase';

interface IProps {
  error?: string|null;
  history?: any;
  passwordOne?: string;
  passwordTwo?: string;
}

interface IState {
  error?: string|null;
  passwordOne?: string;
  passwordTwo?: string;
}

export class PasswordChangeForm extends React.Component<IProps, IState> {
  private static INITIAL_STATE = {
    error: null,
    passwordOne: '',
    passwordTwo: ''
  };

  private static propKey(propertyName: string, value: string): object {
    return { [propertyName]: value };
  }

  constructor(props: IProps) {
    super(props);
    this.state = { ...PasswordChangeForm.INITIAL_STATE };
  }

  public onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    if (!this.state.passwordOne) return;
    
    auth.doPasswordUpdate(this.state.passwordOne).then(() => {
      this.setState(() => ({ ...PasswordChangeForm.INITIAL_STATE }));
    }).catch(error => {
      this.setState(PasswordChangeForm.propKey('error', error));
    });

    event.preventDefault();
  };

  public render() {
    const { passwordOne, passwordTwo, error }: any = this.state;

    const isInvalid = passwordOne !== passwordTwo || passwordOne === '';

    return (
      <React.Fragment>
        <Form inline={true} onSubmit={event => this.onSubmit(event)}>
          <Input
            className="mb-2 mr-sm-2 mb-sm-0"
            type="password" 
            placeholder="New Password" 
            value={passwordOne} 
            onChange={event => this.setStateWithEvent(event, "passwordOne")} 
          />
          <Input
            className="mb-2 mr-sm-2 mb-sm-0"
            type="password" 
            placeholder="Confirm New Password" 
            value={passwordTwo} 
            onChange={event => this.setStateWithEvent(event, "passwordTwo")} 
          />
          <Button disabled={isInvalid} type="submit">
            Change My Password
          </Button>          
        </Form>

        {error && <p>{error.message}</p>}
      </React.Fragment>
    );
  }

  private setStateWithEvent(event: React.ChangeEvent<HTMLInputElement>, columnType: string): void {
    this.setState(
      PasswordChangeForm.propKey(columnType, (event.target as any).value)
    );
  }
}
