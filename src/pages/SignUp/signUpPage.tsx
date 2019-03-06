import React from 'react';
import { SignUpForm } from './signUpForm';
import { Container, Row, Col, Alert } from 'reactstrap';


export class SignUpPage extends React.Component<any, any> {
  render () {
    return (
      <Container>
        <Row>
          <Col lg={{size: 4, offset: 4}} md={{size: 6, offset: 3}} sm="12">
            <Alert className="alert-login" color="light">
              <h4>Sign Up</h4>
              <SignUpForm {...this.props}  />
            </Alert>
          </Col>
        </Row>
      </Container>
    );
  }
}
