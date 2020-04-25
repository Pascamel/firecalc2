import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { Col, Container, Row } from 'reactstrap';
import { AnyAction } from 'redux';
import { ThunkDispatch } from 'redux-thunk';

import { loadBank } from '../../actions';
import Bank from '../../bank';
import { HeaderPanel } from '../../components';
import { AppState } from '../../store';
import { IJournal } from '../../store/journal';

interface IProps {
  authUser: firebase.User | null;
  bank: Bank.IBank;
  bankLoaded: boolean;
  bankLoading: boolean;
  onLoadBank: (uid: string) => void;
  journal: IJournal;
}

const JournalPageBase = ({
  authUser,
  bank,
  journal,
  bankLoaded,
  bankLoading,
  onLoadBank,
}: IProps) => {
  useEffect(() => {
    if (bankLoaded || bankLoading || !authUser) {
      return;
    }
    onLoadBank(authUser.uid);
  }, [authUser, bankLoaded, bankLoading, onLoadBank]);

  return (
    <>
      <HeaderPanel title="Journal" />
      <Container fluid className="top-shadow">
        <Row>
          <Col className="pr-0 pl-0">
            <Container>
              <Row>
                <Col>
                  <h1>Journal</h1>
                  <table className="table table-striped">
                    <thead>
                      <tr>
                        <th>oneoneoneoneone</th>
                        <th>twotwotwotwotwo</th>
                        <th>threethreethreethree</th>
                        <th>fourfourfourfourfour</th>
                        <th>fivefivefivefivefive</th>
                      </tr>
                    </thead>
                    <tbody>
                      {journal.events.map((event) => (
                        <tr>
                          <td>{event.time}</td>
                          <td>{event.event}</td>
                          <td>{event.previous_value}</td>
                          <td>{event.new_value}</td>
                          <td>{event.notSaved ? 'NOT SAVED' : ''}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
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
    journal: state.journalState.journal,
    bank: state.bankState.bank,
    bankLoaded: state.bankState.bankLoaded,
    bankLoading: state.bankState.bankLoading,
  };
};

const mapDispatchToProps = (
  dispatch: ThunkDispatch<AppState, void, AnyAction>
) => {
  return {
    onLoadBank: (uid: string) => {
      dispatch(loadBank(uid));
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(JournalPageBase);
