import moment from 'moment';
import preval from 'preval.macro';
import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { Col, Container, ListGroup, ListGroupItem, Media, Row } from 'reactstrap';
import { AnyAction } from 'redux';
import { ThunkDispatch } from 'redux-thunk';

import { IconProp } from '@fortawesome/fontawesome-svg-core';

import { loadBank } from '../../actions';
import Bank from '../../bank';
import { Icon, LoadingPanel, Mobile, NotMobile } from '../../components';
import ROUTES from '../../constants/routes';
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
          <Mobile>
            <div className="display-block">
              <b>{value}</b>
            </div>
          </Mobile>
        </Media>
        <NotMobile>
          <Media left>
            <b>{value}</b>
          </Media>
        </NotMobile>
      </Media>
    </ListGroupItem>
  );
};

const HomePageBase = ({ bank, authUser, onLoadBank, bankLoaded }: IProps) => {
  const buildDate = moment(preval`module.exports = new Date();`)
    .utc()
    .format('YYYYMMDD-HHmmss');

  useEffect(() => {
    if (bankLoaded || !authUser) return;

    if (authUser) onLoadBank(authUser.uid);
  }, [authUser, bankLoaded, onLoadBank]);

  if (!bankLoaded) return <LoadingPanel color="none" />;

  return (
    <Container fluid className="top-shadow">
      <Row>
        <Col>
          <Container>
            <Row>
              <Col md={6} xs={12}>
                <Mobile>
                  <div className="background-wrapper mobile">
                    <div className="background mobile piggy-bank" />
                  </div>
                </Mobile>
                <NotMobile>
                  <div className="background-wrapper">
                    <div className="background piggy-bank" />
                  </div>
                </NotMobile>
              </Col>
              <Col md={6} xs={12} className="pt-5">
                <h4>Last update</h4>
                <ListGroup flush>
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
                    icon="cogs"
                  />
                </ListGroup>
                <ListGroup className="pt-3">
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
