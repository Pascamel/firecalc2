import * as React from 'react';
import { SignInForm } from './signInForm';
import { SignUpButton } from '../SignUp';
import { PasswordForgotButton } from '../PasswordForget';
import { Container, Row, Col, Alert } from 'reactstrap';
import { HeaderPanel } from '../../components';


export class  SignInPage extends React.Component<any, any> {
  render() {
    return (
      <React.Fragment>
        <HeaderPanel title="Sign in" />
        <Container fluid className="top-shadow container-centered">
          <Row>
            <Col>              
              <Container>  
                <Row>
                  <Col lg={{size: 4, offset: 4}} md={{size: 6, offset: 3}} sm="12">
                    <Alert color="background">  
                      {/* <h4>Sign In</h4> */}
                      <SignInForm {...this.props} />
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
      </React.Fragment>
    );
  }
}
