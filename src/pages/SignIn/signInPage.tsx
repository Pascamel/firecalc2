import * as React from 'react';
import { Container, Row, Col, Alert } from 'reactstrap';

import { SignInForm } from './signInForm';
import { SignUpButton } from '../SignUp';
import { PasswordForgotButton } from '../PasswordForget';
import { HeaderPanel } from '../../components';
import { RouteComponentProps } from 'react-router';


export const SignInPage = (props: RouteComponentProps) => {
  return (
    <>
      <HeaderPanel title="Sign in" />
      <Container fluid className="top-shadow container-centered">
        <Row>
          <Col>              
            <Container>  
              <Row>
                <Col lg={{size: 4, offset: 4}} md={{size: 6, offset: 3}} sm="12">
                  <Alert className="form-container" color="background">  
                    {/* <h4>Sign In</h4> */}
                    <SignInForm {...props} />
                    <PasswordForgotButton />  
                    <hr />
                    <SignUpButton />
                  </Alert>
                </Col>
              </Row>
            </Container>
          </Col>
        </Row>
      </Container>
    </>
  );
}
