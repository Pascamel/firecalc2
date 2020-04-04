import { LocationState } from 'history';
import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { Col, Container, Row } from 'reactstrap';
import { compose } from 'recompose';

import { AppState } from '../../store';
import NavigationAuth from './auth';
import NavigationNonAuth from './nonAuth';

interface IProps {
  location?: LocationState;
  authUser?: firebase.User | null;
  darkMode: boolean;
  updated: boolean;
}

const NavigationBar = (props: IProps | any) => {
  return (
    <Container fluid className="nav-container">
      <Row>
        <Col>
          <Container>
            <Row>
              <Col>
                {props.authUser ? (
                  <NavigationAuth {...props} />
                ) : (
                  <NavigationNonAuth {...props} />
                )}
              </Col>
            </Row>
          </Container>
        </Col>
      </Row>
    </Container>
  );
};

const mapStateToProps = (state: AppState) => {
  return {
    authUser: state.sessionState.authUser,
    darkMode: state.sessionState.darkMode,
    updated:
      state.bankState.bankSavingsUpdated ||
      state.bankState.bankIncomeUpdated ||
      state.bankState.bankOthersUpdated ||
      state.bankState.bankHeadersUpdated
  };
};

export default compose(withRouter, connect(mapStateToProps))(NavigationBar);
