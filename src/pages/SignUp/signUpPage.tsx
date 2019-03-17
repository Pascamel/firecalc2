import React from 'react';
import { Container, Row, Col, Alert } from 'reactstrap';
import { SignUpForm } from './signUpForm';


export class SignUpPage extends React.Component<any, any> {
  render () {
    return (
      <Container className="container-centered">
        <Row>
          <Col lg={{size: 4, offset: 4}} md={{size: 6, offset: 3}} sm="12">
            <Alert className="alert-login" color="background">
              <h4>Sign Up</h4>
              <SignUpForm {...this.props}  />
            </Alert>
          </Col>
        </Row>
      </Container>
    );
  }
}
