import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { Col, Container, Row } from 'reactstrap';
import Button from 'reactstrap/lib/Button';
import ButtonGroup from 'reactstrap/lib/ButtonGroup';

import { HeaderPanel, Icon, LoadingPanel } from '../../components';
import { firestore } from '../../firebase';
import { AppState } from '../../store';
import { IEvents } from '../../store/journal';

interface IProps {
  authUser: firebase.User | null;
}

const PAGE_SIZE = 50;

const JournalPageBase = ({ authUser }: IProps) => {
  const [loading, setLoading] = useState(true);
  const [journal, setJournal] = useState<IEvents>([]);
  const [page, setPage] = useState(1);

  useEffect(() => {
    if (!authUser) {
      return;
    }
    loadJournal(authUser.uid);
  }, [authUser]);

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

  const firstPage = () => {
    setPage(1);
  };

  const prevPage = () => {
    setPage((page) => Math.max(page - 1, 1));
  };

  const nextPage = () => {
    const maxPage = Math.ceil(journal.length / PAGE_SIZE);
    console.log('nextpage', maxPage);
    setPage(Math.min(page + 1, maxPage));
  };

  const lastPage = () => {
    const maxPage = Math.ceil(journal.length / PAGE_SIZE);
    setPage(maxPage);
  };

  const pagerBtns = (
    <ButtonGroup className="pull-right" color="light">
      <Button color="outline-secondary" onClick={firstPage}>
        <Icon icon="step-backward"></Icon>
      </Button>
      <Button color="outline-secondary" onClick={prevPage}>
        <Icon icon="backward"></Icon>
      </Button>
      <Button color="outline-secondary">
        {`${(page - 1) * PAGE_SIZE + 1}-${page * PAGE_SIZE} or ${
          journal.length
        }`}
      </Button>
      <Button color="outline-secondary" onClick={nextPage}>
        <Icon icon="forward"></Icon>
      </Button>
      <Button color="outline-secondary" onClick={lastPage}>
        <Icon icon="step-forward"></Icon>
      </Button>
    </ButtonGroup>
  );

  const refreshBtn = (
    <Button
      color="outline-secondary"
      onClick={() => authUser && loadJournal(authUser?.uid)}
    >
      <Icon icon="sync" className="mr-1" />
      Reload
    </Button>
  );

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
                  {refreshBtn}
                  {pagerBtns}
                </Col>
              </Row>
              <Row>
                <Col>
                  <table className="table table-sm table-striped table-journal mt-3">
                    <thead>
                      <tr>
                        <th scope="col">#</th>
                        <th scope="col">Event</th>
                        <th scope="col">Label</th>
                        <th scope="col">Previous</th>
                        <th scope="col">New</th>
                        <th scope="col">Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {journal
                        .slice(PAGE_SIZE * (page - 1), page * PAGE_SIZE)
                        .map((event, idx: number) => (
                          <tr key={idx}>
                            <th scope="row">{idx}</th>
                            <td>{event.event}</td>
                            <td>{event.label}</td>
                            <td>{event.previous_value}</td>
                            <td>{event.new_value}</td>
                            <td>{moment(event.time).fromNow()}</td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </Col>
              </Row>
              <Row>
                <Col>
                  {refreshBtn}
                  {pagerBtns}
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

export default connect(mapStateToProps)(JournalPageBase);
