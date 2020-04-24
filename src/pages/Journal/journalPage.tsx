import React, { Dispatch, useEffect } from 'react';
import { connect } from 'react-redux';
import { Col, Container, Row } from 'reactstrap';

import { loadBank } from '../../actions';
import Bank from '../../bank';
import { AppState } from '../../store';

interface IProps {
  authUser: firebase.User | null;
  bank: Bank.IBank;
  bankLoaded: boolean;
  onLoadBank: (uid: string) => void;
}

const JournalPageBase = ({
  authUser,
  // bank,
  bankLoaded,
  onLoadBank,
}: IProps) => {
  useEffect(() => {
    if (bankLoaded || !authUser) return;

    onLoadBank(authUser.uid);
  }, [authUser, bankLoaded, onLoadBank]);

  return (
    <Container fluid className="top-shadow">
      <Row>
        <Col className="pr-0 pl-0">
          <Container>
            <Row>
              <Col>
                <h1>Journal</h1>
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
    bank: state.bankState.bank,
    bankLoaded: state.bankState.bankLoaded,
  };
};

const mapDispatchToProps = (dispatch: Dispatch<any>) => {
  return {
    onLoadBank: (uid: string) => {
      dispatch(loadBank(uid));
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(JournalPageBase);
