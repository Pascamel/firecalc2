import React from 'react';
import { SignUpForm } from './signUpForm';
import { Container, Row, Col, Alert } from 'reactstrap';


export const SignUpPage = () => (
  <Container>
    <Row>
      <Col lg={{size: 4, offset: 4}} md={{size: 6, offset: 3}} sm="12">
        <Alert className="alert-login" color="light">
          <h1>SignUp</h1>
          <SignUpForm  />
        </Alert>
      </Col>
    </Row>
  </Container>
);
