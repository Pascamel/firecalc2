import React, { useState } from 'react';
import { connect } from 'react-redux';
import { Col, Container, ListGroup, ListGroupItem, Row } from 'reactstrap';
import Alert from 'reactstrap/lib/Alert';

import { HeaderPanel, NavButtonGroup, PanelTitle } from '../../components';
import { AppState } from '../../store';
import { PasswordForgetForm } from '../PasswordForget/pwForgetForm';
import { PasswordChangeForm } from './PasswordChangeForm';

interface IProps {
  authUser: firebase.User;
}

const PAGES = ['Account', 'Change Password', 'Reset Password'];

const AccountPageBase2 = ({ authUser }: IProps) => {
  const [page, setPage] = useState(PAGES[0]);

  const prevPage = () => {
    const index = PAGES.indexOf(page);
    const newIndex = (index + PAGES.length - 1) % PAGES.length;

    setPage(PAGES[newIndex]);
  };

  const nextPage = () => {
    const index = PAGES.indexOf(page);
    const newIndex = (index + 1) % PAGES.length;

    setPage(PAGES[newIndex]);
  };

  return (
    <>
      <HeaderPanel title="My account" />
      <Container fluid className="top-shadow">
        <Row>
          <Col>
            <Container>
              <Row>
                <Col className="d-none d-sm-inline-block" sm={2}>
                  <ListGroup>
                    {PAGES.map((p, key: number) => (
                      <ListGroupItem
                        key={key}
                        className="text-left cursor nowrap-ellipsis"
                        color={p === page ? 'primary' : 'darker'}
                        onClick={() => {
                          setPage(p);
                        }}
                      >
                        {p}
                      </ListGroupItem>
                    ))}
                  </ListGroup>
                </Col>
                <Col className="d-inline-block d-sm-none" xs={12}>
                  <NavButtonGroup
                    color="light"
                    button-color="outline-secondary"
                    on-click={[prevPage, nextPage]}
                    label={'todo'}
                  />
                </Col>
                <Col xs={12} sm={10}>
                  {page === PAGES[0] && (
                    <Alert color="background">
                      <PanelTitle title="Account" />
                      {(authUser as firebase.User).email}
                    </Alert>
                  )}
                  {page === PAGES[1] && (
                    <Alert color="background">
                      <PanelTitle title="Change your password" />
                      <PasswordChangeForm />
                    </Alert>
                  )}
                  {page === PAGES[2] && (
                    <Alert color="background">
                      <PanelTitle title="Reset your password" />
                      <PasswordForgetForm />
                    </Alert>
                  )}
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
    authUser: state.sessionState.authUser,
  };
};

export const AccountPageBase = connect(mapStateToProps)(AccountPageBase2);
