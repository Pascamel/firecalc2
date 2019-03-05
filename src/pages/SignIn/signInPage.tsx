import * as React from 'react';
import { PasswordForgetLink } from '../PasswordForget';
import { SignUpLink } from '../SignUp';
import { SignInForm } from './signInForm';
import { Container, Row, Col, Alert } from 'reactstrap';


export const SignInPage = ({ history }: { [key: string]: any }) => (
  <Container>
    <Row>
      <Col lg={{size: 4, offset: 4}} md={{size: 6, offset: 3}} sm="12">
        <Alert className="alert-login" color="light">
          <h4>SignIn</h4>
          <SignInForm history={history} />
          <SignUpLink />
          <PasswordForgetLink />  
        </Alert>
      </Col>
    </Row>
  </Container>
);