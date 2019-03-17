import React from 'react';
import { Container, Row, Col, Alert } from 'reactstrap';
import { PasswordForgetForm } from './pwForgetForm';


export default class PasswordForgetPage extends React.Component<{}, {}> {
  render () {
    return (
      <React.Fragment>
        <Container className="container-centered">
        <Row>
          <Col lg={{size: 4, offset: 4}} md={{size: 6, offset: 3}} sm="12">
            <Alert className="alert-login" color="background">  
              <h4>Create a new password</h4>
              <PasswordForgetForm />
            </Alert>
          </Col>
        </Row>
      </Container>
      </React.Fragment>
    );
  }
}
