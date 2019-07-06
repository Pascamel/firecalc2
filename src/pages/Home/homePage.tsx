import { IconProp } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import moment from 'moment';
import preval from 'preval.macro';
import React, { Dispatch, useEffect } from 'react';
import { connect } from 'react-redux';
import { Col, Container, ListGroup, ListGroupItem, Media, Row } from 'reactstrap';

import { loadBank } from '../../actions';
import Bank from '../../bank';
import { LoadingPanel } from '../../components';
import * as ROUTES from '../../constants/routes';
import helpers from '../../helpers';
import { AppState } from '../../store';

interface IItemProps {
  label: string;
  value: string;
  route: string;
  icon: IconProp;
};

interface IProps {
  authUser: firebase.User|null;
  bank: Bank.IBank;
  bankLoaded: boolean;
  onLoadBank: (uid: string) => void;
}

const Item = (props: IItemProps) => {
  const {label, value, route, icon} = props;
  if (!value) return null

  return (
    <ListGroupItem>
      <Media href={route}>
        <Media left middle style={{width: '40px'}}>
          <FontAwesomeIcon icon={icon} size="lg" />
        </Media>
        <Media body>
          {label}
        </Media>
        <Media right>
          <b>{value}</b>
        </Media>
      </Media>
    </ListGroupItem>
  );
}

const HomePageBase = (props: IProps) => {
  const { bank, authUser, onLoadBank, bankLoaded } = props;
  const buildDate: string = moment(preval`module.exports = new Date();`).utc().format('YYYYMMDD-HHmmss');

  useEffect(() => {
    if (bankLoaded || !authUser ) return;
    
    if (authUser) onLoadBank(authUser.uid);
  }, [authUser, bankLoaded, onLoadBank]);
  
  if (!bankLoaded) return <LoadingPanel color="none" />; 

  return (
    <Container fluid className="top-shadow">
      <Row>
        <Col>
          <Container>
            <Row>
              <Col xs={6}>
                <div className="background-wrapper">
                  <div className="background piggy-bank" />
                </div>
              </Col>
              <Col xs={6} className="pt-5">
                <h4>Last update</h4>
                <ListGroup flush>
                  <Item label="Savings" value={'Updated ' + bank.lastupdate.savings} route={ROUTES.SAVINGS} icon="piggy-bank" />
                  <Item label="Revenues" value={'Updated ' + bank.lastupdate.income} route={ROUTES.SAVINGS} icon="user-tie" />
                  <Item label="Others (Net worth, Expenses...)" value={'Updated ' + bank.lastupdate.others} route={helpers.currentMonthRoute()} icon="university" />
                  <Item label="Settings" value={'Updated ' + bank.lastupdate.headers} route={ROUTES.SAVINGS} icon="cogs" />
                </ListGroup>
                <ListGroup className="pt-3">
                  <Item label="Build" value={buildDate} route={ROUTES.HOME} icon="laptop-code" />
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
