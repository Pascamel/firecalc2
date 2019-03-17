import React from 'react';
import { Container, Row, Col, Alert } from 'reactstrap';
import { SignUpForm } from './signUpForm';
import HeaderPanel from '../../components/headerPanel';


export class SignUpPage extends React.Component<any, any> {
  render () {
    return (
      <React.Fragment>
        <HeaderPanel title="Create an account" />
        <Container fluid className="top-shadow container-centered">
          <Row>
            <Col>              
              <Container>  
                <Row>
                  <Col lg={{size: 4, offset: 4}} md={{size: 6, offset: 3}} sm="12">
                    <Alert className="alert-login" color="background">
                      <SignUpForm {...this.props}  />
                    </Alert>
                  </Col>
                </Row>
              </Container>
            </Col>
          </Row>
        </Container>
      </React.Fragment>
    );
  }
}
