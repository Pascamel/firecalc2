import React, { Dispatch, useEffect } from 'react';
import { connect } from 'react-redux';
import { Alert, Col, Container, Row } from 'reactstrap';

import { loadBank, saveBank } from '../../actions';
import Bank from '../../bank';
import { LoadingPanel, SavePanel } from '../../components';
import { AppState } from '../../store';
import Table from './table';

interface IProps {
  authUser: firebase.User|null;
  bankLoaded: boolean;
  onLoadBank: (uid: string) => void;
  onSaveBank: (uid: string, bank: Bank.IBank) => void;
}

const RevenuePageBase = (props: IProps) => {
  const { authUser, onLoadBank, bankLoaded } = props;

  useEffect(() => {
    if (bankLoaded || !authUser ) return;
    
    onLoadBank(authUser.uid);
  }, [authUser, bankLoaded, onLoadBank]);

  if (!bankLoaded) return <LoadingPanel />;
  
  return (
    <>
      <SavePanel label="Revenues" />
      <Container fluid className="top-shadow">
        <Row>
          <Col className="pr-0 pl-0">
            <Container>
              <Row>
                <Col>
                  <Alert color="background">
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
    },
    onSaveBank: (uid: string, bank: Bank.IBank) => {
      dispatch(saveBank(uid, bank));
    }
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(RevenuePageBase);