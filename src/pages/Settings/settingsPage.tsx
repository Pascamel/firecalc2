import React, { Dispatch, useEffect } from 'react';
import { connect } from 'react-redux';
import { Col, Container, Row } from 'reactstrap';

import { loadBank } from '../../actions';
import { LoadingPanel, SavePanel } from '../../components';
import { AppState } from '../../store';
import Incomes from './incomes';
import Savings from './savings';
import StartingPoint from './startingPoint';

interface IProps {
  authUser: firebase.User|null;
  bankLoaded: boolean;
  onLoadBank: (uid: string) => void;
}

function SettingsPageBase ({authUser, bankLoaded, onLoadBank }: IProps) {
  useEffect(() => {
    if (bankLoaded || !authUser ) return;
    
    onLoadBank(authUser.uid);
  })
  
  if (!bankLoaded) return <LoadingPanel />;

  return (
    <React.Fragment>
      <SavePanel label="Settings" />
      <Container fluid className="top-shadow">
        <Row>
          <Col className="pl-0 pr-0">
            <Container>
              <StartingPoint /> 
              <Savings /> 
              <Incomes /> 
            </Container>
          </Col>
        </Row>
      </Container>
    </React.Fragment>
  );
}

const mapStateToProps = (state: AppState) => {
  return ({
    authUser: state.sessionState.authUser,
    bankLoaded: state.bankState.bankLoaded
  });
}

const mapDispatchToProps = (dispatch: Dispatch<any>) => {
  return {
    onLoadBank: (uid: string) => {
      dispatch(loadBank(uid));
    }
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SettingsPageBase);
