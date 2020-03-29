import React from 'react';
import { RouteComponentProps } from 'react-router';
import { Alert, Col, Container, Row } from 'reactstrap';

import { HeaderPanel } from '../../components';
import { SignUpForm } from './signUpForm';

export const SignUpPage = (props: RouteComponentProps) => {
  return (
    <>
      <HeaderPanel title="Create an account" />
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
                    {/* <h4>Sign Up</h4> */}
                    <SignUpForm {...props} />
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
