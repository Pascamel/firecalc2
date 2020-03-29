import React from 'react';
import { connect } from 'react-redux';
import {
  Col,
  Container,
  ListGroup,
  ListGroupItem,
  ListGroupItemHeading,
  Row
} from 'reactstrap';

import { HeaderPanel } from '../../components';
import { AppState } from '../../store';
import { PasswordForgetForm } from '../PasswordForget/pwForgetForm';
import { PasswordChangeForm } from './PasswordChangeForm';

interface IProps {
  authUser: firebase.User;
}

const AccountPageBase2 = (props: IProps) => {
  const { authUser } = props;

  return (
    <>
      <HeaderPanel title="My account" />
      <Container fluid className="top-shadow">
        <Row>
          <Col>
            <Container>
              <Row>
                <Col>
                  <ListGroup>
                    <ListGroupItem>
                      <ListGroupItemHeading>Account</ListGroupItemHeading>
                      {(authUser as firebase.User).email}
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
    </>
  );
};

const mapStateToProps = (state: AppState) => {
  return {
    authUser: state.sessionState.authUser
  };
};

export const AccountPageBase = connect(mapStateToProps)(AccountPageBase2);
