import moment from 'moment';
import preval from 'preval.macro';
import React, { Dispatch, useEffect } from 'react';
import { connect } from 'react-redux';
import { NavLink } from 'react-router-dom';
import { Col, Container, ListGroup, ListGroupItem, Row } from 'reactstrap';

import { loadBank } from '../../actions';
import Bank from '../../bank';
import { LoadingPanel } from '../../components';
import * as ROUTES from '../../constants/routes';
import helpers from '../../helpers';
import { AppState } from '../../store';

interface IProps {
  authUser: firebase.User|null;
  bank: Bank.IBank;
  bankLoaded: boolean;
  onLoadBank: (uid: string) => void;
}

const Item = ({label, value, route}: {label: string, value: string, route: string}) => {
  if (!value) return null

  return (
    <ListGroupItem>
      <NavLink to={route}>{label}</NavLink>
      <span className="pull-right">
        Last update <b>{value}</b>
      </span>
    </ListGroupItem>
  );
}

const HomePageBase = (props: IProps) => {
  const { bank, authUser, onLoadBank, bankLoaded } = props;
  const buildDate: string = moment(preval`module.exports = new Date();`).utc().format('YYYYMMDD-HHmmss');

  useEffect(() => {
    if (bankLoaded || !authUser ) return;

    onLoadBank(authUser.uid);
  }, [authUser, bankLoaded, onLoadBank]);
  
  if (!bankLoaded) return <LoadingPanel color="none" />;  

  return (
    <Container fluid className="top-shadow">
      <Row>
        <Col>
          <Container>
            <Row>
              <Col xs={6}>
                <div className="piggy-wrapper">
                  <div className="piggy-bank" />
                </div>
              </Col>
              <Col xs={6} className="pt-5">
                <h4>Last update</h4>
                <ListGroup flush>
                  <Item label="Savings" value={bank.lastupdate.savings} route={ROUTES.SAVINGS} />
                  <Item label="Revenues" value={bank.lastupdate.income} route={ROUTES.SAVINGS} />
                  <Item label="Others (Net worth, Expenses...)" value={bank.lastupdate.others} route={helpers.currentMonthRoute()} />
                  <Item label="Settings" value={bank.lastupdate.headers} route={ROUTES.SAVINGS} />
                </ListGroup>
                <ListGroup className="pt-3">
                  <ListGroupItem>
                    Build
                    <span className="pull-right">
                      {buildDate}
                    </span>
                  </ListGroupItem>
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
  return ({
    bank: state.bankState.bank,
    bankLoaded: state.bankState.bankLoaded
  });
}

const mapDispatchToProps = (dispatch: Dispatch<any>) => {
  return {
    onLoadBank: (uid: string) => dispatch(loadBank(uid))
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(HomePageBase);
