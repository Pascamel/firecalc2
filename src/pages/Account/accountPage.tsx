import * as React from 'react';
import { connect } from 'react-redux';
import { Container, Row, Col, ListGroup, ListGroupItem, ListGroupItemHeading } from 'reactstrap';
import { PasswordForgetForm } from '../PasswordForget/pwForgetForm';
import { PasswordChangeForm } from './PasswordChangeForm';
import { HeaderPanel } from '../../components';


class AccountPageBase2 extends React.Component<any, {}> {
  render () {
    const {authUser} = this.props;

    return (
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
    );
  }
}

const mapStateToProps = (state: any) => {
  return ({
    authUser: state.sessionState.authUser,
  });
}

export const AccountPageBase = connect(mapStateToProps)(AccountPageBase2);