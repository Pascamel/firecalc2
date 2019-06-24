import React from 'react';
import { Alert, Col, Container, Row } from 'reactstrap';

import { PasswordForgetForm } from './pwForgetForm';

const PasswordForgetPage = () => (
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
);

export default PasswordForgetPage;
