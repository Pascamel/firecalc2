import moment from 'moment';
import preval from 'preval.macro';
import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { Col, Container, ListGroup, ListGroupItem, Media, Row } from 'reactstrap';
import { AnyAction } from 'redux';
import { ThunkDispatch } from 'redux-thunk';

import { IconProp } from '@fortawesome/fontawesome-svg-core';

import { loadBank } from '../../actions';
import Bank from '../../bank';
import { Icon, LoadingPanel } from '../../components';
import ROUTES from '../../constants/routes';
import { firestore } from '../../firebase';
import { currentMonthRoute } from '../../helpers';
import { AppState } from '../../store';

interface IItemProps {
  label: string;
  value: string;
  route: string;
  icon: IconProp;
}

interface IProps {
  authUser: firebase.User | null;
  bank: Bank.IBank;
  bankLoaded: boolean;
  bankLoading: boolean;
  onLoadBank: (uid: string) => void;
}

const Item = ({ label, value, route, icon }: IItemProps) => {
  if (!value) {
    return null;
  }

  return (
    <ListGroupItem>
      <Media href={route}>
        <Media left middle style={{ width: '40px' }}>
          <Icon icon={icon} size="lg" />
        </Media>
        <Media body>
          {label}
          <div className="d-block d-sm-none">
            <b>{value}</b>
          </div>
        </Media>
        <Media left className="d-none d-sm-block">
          <b>{value}</b>
        </Media>
      </Media>
    </ListGroupItem>
  );
};

const HomePageBase = ({
  bank,
  authUser,
  onLoadBank,
  bankLoaded,
  bankLoading,
}: IProps) => {
  const [lastUpdateJournal, setLastUpdateJournal] = useState('N/A');
  const buildDate = moment(preval`module.exports = new Date();`)
    .utc()
    .format('YYYYMMDD-HHmmss');

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
    firestore.getJournal(authUser.uid).then((data) => {
      const object = data.data();
      if (!object) {
        return;
      }
      setLastUpdateJournal(moment(object.last_update).fromNow());
    });
  }, [authUser]);

  if (!bankLoaded) return <LoadingPanel color="none" />;

  return (
    <Container fluid className="top-shadow">
      <Row>
        <Col>
          <Container>
            <Row>
              <Col md={6} xs={12}>
                <div className="d-block d-sm-none">
                  <div className="background-wrapper mobile">
                    <div className="background mobile piggy-bank" />
                  </div>
                </div>
                <div className="d-none d-sm-block">
                  <div className="background-wrapper">
                    <div className="background piggy-bank" />
                  </div>
                </div>
              </Col>
              <Col md={6} xs={12} className="pt-5">
                <h4>Last update</h4>
                <ListGroup flush className="pb-3">
                  <Item
                    label="Savings"
                    value={`Updated ${bank.lastupdate.savings}`}
                    route={ROUTES.SAVINGS}
                    icon="piggy-bank"
                  />
                  <Item
                    label="Revenues"
                    value={`Updated ${bank.lastupdate.income}`}
                    route={ROUTES.SAVINGS}
                    icon="user-tie"
                  />
                  <Item
                    label="Expenses"
                    value={`Updated ${bank.lastupdate.expenses}`}
                    route={currentMonthRoute()}
                    icon="credit-card"
                  />
                  <Item
                    label="Others (Net worth, Notes...)"
                    value={`Updated ${bank.lastupdate.others}`}
                    route={currentMonthRoute()}
                    icon="university"
                  />
                  <Item
                    label="Settings"
                    value={`Updated ${bank.lastupdate.headers}`}
                    route={ROUTES.SAVINGS}
                    icon="sliders-h"
                  />
                </ListGroup>
                <h4>Activity</h4>
                <ListGroup flush className="pb-3">
                  <Item
                    label="Journal"
                    value={lastUpdateJournal}
                    route={ROUTES.JOURNAL}
                    icon={['fas', 'history']}
                  />
                </ListGroup>
                <h4>About</h4>
                <ListGroup flush className="pb-3">
                  <Item
                    label="Build"
                    value={buildDate}
                    route={ROUTES.HOME}
                    icon="laptop-code"
                  />
                </ListGroup>
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
    bank: state.bankState.bank,
    bankLoaded: state.bankState.bankLoaded,
    bankLoading: state.bankState.bankLoading,
  };
};

const mapDispatchToProps = (
  dispatch: ThunkDispatch<AppState, void, AnyAction>
) => {
  return {
    onLoadBank: (uid: string) => dispatch(loadBank(uid)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(HomePageBase);
