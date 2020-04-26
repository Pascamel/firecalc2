import _ from 'lodash';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { Col, Container, Row } from 'reactstrap';
import Button from 'reactstrap/lib/Button';
import ButtonGroup from 'reactstrap/lib/ButtonGroup';
import { AnyAction } from 'redux';
import { ThunkDispatch } from 'redux-thunk';

import { loadBank } from '../../actions';
import Bank from '../../bank';
import { HeaderPanel, Icon, LoadingPanel } from '../../components';
import { firestore } from '../../firebase';
import { AppState } from '../../store';
import { IEvents } from '../../store/journal';

interface IProps {
  authUser: firebase.User | null;
  bank: Bank.IBank;
  bankLoaded: boolean;
  bankLoading: boolean;
  onLoadBank: (uid: string) => void;
}

const JournalPageBase = ({
  authUser,
  bank,
  bankLoaded,
  bankLoading,
  onLoadBank,
}: IProps) => {
  const [loading, setLoading] = useState(true);
  const [journal, setJournal] = useState<IEvents>([]);

  useEffect(() => {
    if (bankLoaded || bankLoading || !authUser) {
      return;
    }
    onLoadBank(authUser.uid);
  }, [authUser, bankLoaded, bankLoading, onLoadBank]);

  useEffect(() => {
    if (!authUser) {
      return;
    }

    loadJournal(authUser.uid);
  }, []);

  const loadJournal = async (uid: string) => {
    const snapshot = await firestore.getJournal(uid);
    if (!snapshot) {
      setJournal([]);
    }

    const data = (snapshot.data()?.events ?? []) as IEvents;

    data.sort((a, b) => b.time - a.time);

    setJournal(data);
    setLoading(false);
  };

  if (loading) {
    return <LoadingPanel />;
  }

  return (
    <>
      <HeaderPanel title="Journal" />
      <Container fluid className="top-shadow">
        <Row>
          <Col className="pr-0 pl-0">
            <Container>
              <Row>
                <Col>
                  <ButtonGroup className="pull-right" color="light">
                    <Button color="outline-secondary">
                      <Icon icon="step-backward"></Icon>
                    </Button>
                    <Button color="outline-secondary">
                      <Icon icon="backward"></Icon>
                    </Button>
                    <Button color="outline-secondary">{`1-${journal.length} of ${journal.length}`}</Button>
                    <Button color="outline-secondary">
                      <Icon icon="forward"></Icon>
                    </Button>
                    <Button color="outline-secondary">
                      <Icon icon="step-forward"></Icon>
                    </Button>
                  </ButtonGroup>
                </Col>
              </Row>
              <Row>
                <Col>
                  <table className="table table-sm table-striped mt-3">
                    <thead>
                      <tr>
                        <th scope="col">#</th>
                        <th scope="col">Date</th>
                        <th scope="col">Event</th>
                        <th scope="col">Label</th>
                        <th scope="col">Previous</th>
                        <th scope="col">New</th>
                      </tr>
                    </thead>
                    <tbody>
                      {journal.map((event, idx: number) => (
                        <tr key={idx}>
                          <th scope="row">{idx}</th>
                          <td>{moment(event.time).fromNow()}</td>
                          <td>{event.event}</td>
                          <td>{event.label}</td>
                          <td>{event.previous_value}</td>
                          <td>{event.new_value}</td>
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
