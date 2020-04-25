import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { Alert, Col, Container, Row } from 'reactstrap';
import { AnyAction } from 'redux';
import { ThunkDispatch } from 'redux-thunk';

import { loadBank, saveBank } from '../../actions';
import Bank from '../../bank';
import { LoadingPanel, SavePanel } from '../../components';
import { AppState } from '../../store';
import Table from './table';

interface IProps {
  authUser: firebase.User | null;
  bankLoaded: boolean;
  onLoadBank: (uid: string) => void;
  onSaveBank: (uid: string, bank: Bank.IBank) => void;
}

const SavingsPageBase = ({ authUser, onLoadBank, bankLoaded }: IProps) => {
  useEffect(() => {
    if (bankLoaded || !authUser) return;

    onLoadBank(authUser.uid);
  }, [authUser, bankLoaded, onLoadBank]);

  if (!bankLoaded) return <LoadingPanel />;

  return (
    <>
      <SavePanel label="Savings" />
      <Container fluid className="top-shadow">
        <Row>
          <Col className="pr-0 pl-0">
            <Container>
              <Row>
                <Col>
                  <Alert color="background" className="table-container">
                    <Table />
                  </Alert>
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
    bankLoaded: state.bankState.bankLoaded,
  };
};

const mapDispatchToProps = (
  dispatch: ThunkDispatch<AppState, void, AnyAction>
) => {
  return {
    onLoadBank: (uid: string) => {
      dispatch(loadBank(uid));
    },
    onSaveBank: (uid: string, bank: Bank.IBank) => {
      dispatch(saveBank(uid, bank, true, false, false, false));
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(SavingsPageBase);
