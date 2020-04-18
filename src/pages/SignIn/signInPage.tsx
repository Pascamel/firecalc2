import * as React from 'react';
import { RouteComponentProps } from 'react-router';
import { Alert, Col, Container, Row } from 'reactstrap';

import { HeaderPanel } from '../../components';
import { PasswordForgotButton } from '../PasswordForget';
import { SignUpButton } from '../SignUp';
import { SignInForm } from './signInForm';

export const SignInPage = (props: RouteComponentProps) => {
  return (
    <>
      <HeaderPanel title="Sign in" />
      <Container fluid className="top-shadow container-centered">
        <Row>
          <Col>
            <Container>
              <Row>
                <Col
                  lg={{ size: 4, offset: 4 }}
                  md={{ size: 6, offset: 3 }}
                  sm="12"
                >
                  <Alert className="form-container" color="background">
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
};
