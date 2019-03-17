import * as React from 'react';
import { SignInForm } from './signInForm';
import { SignUpButton } from '../SignUp';
import { PasswordForgotButton } from '../PasswordForget';
import { Container, Row, Col, Alert } from 'reactstrap';


export class  SignInPage extends React.Component<any, any> {
  render() {
    return (
      <Container className="container-centered">
        <Row>
          <Col lg={{size: 4, offset: 4}} md={{size: 6, offset: 3}} sm="12">
            <Alert color="background">  
              <h4>Sign In</h4>
              <SignInForm {...this.props} />
              <PasswordForgotButton />  
              <hr />
              <SignUpButton />
            </Alert>
          </Col>
        </Row>
      </Container>
    );
  }
}
