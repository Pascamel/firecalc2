import * as React from 'react';
import { Container, Row, Col, ListGroup, ListGroupItem, ListGroupItemHeading } from 'reactstrap';
import { AuthUserContext } from '../../firebase/AuthUserContext';
import { PasswordForgetForm } from '../PasswordForget/pwForgetForm';
import { PasswordChangeForm } from './PasswordChangeForm';
import { HeaderPanel } from '../../components';


export default class AccountPageBase extends React.Component {
  render () {
    return (
      <AuthUserContext.Consumer>
        {authUser => (
          <React.Fragment>
            <HeaderPanel title="My account" />
            <Container fluid className="top-shadow">
              <Row>
                <Col>
                  <Container>
                    <Row>
                      <Col>
                        <ListGroup>     
                          <ListGroupItem>
                            <ListGroupItemHeading>
                              Account
                            </ListGroupItemHeading>
                            {(authUser as any).email}
                          </ListGroupItem>
                          <ListGroupItem>
                            <ListGroupItemHeading>
                              Change your password
                            </ListGroupItemHeading>
                            <PasswordChangeForm />
                          </ListGroupItem>
                          <ListGroupItem>
                            <ListGroupItemHeading>
                              Reset your password
                            </ListGroupItemHeading>
                            <PasswordForgetForm />
                          </ListGroupItem>
                        </ListGroup>
                      </Col>
                    </Row>
                  </Container>
                </Col>
              </Row>
            </Container>
          </React.Fragment>
        )}
      </AuthUserContext.Consumer>
    );
  }
}
