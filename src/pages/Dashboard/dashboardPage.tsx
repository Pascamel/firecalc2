import React, { Dispatch } from 'react';
import { connect } from 'react-redux';
import { NavLink } from 'react-router-dom';
import { Col, Container, ListGroup, ListGroupItem, Row } from 'reactstrap';

import { loadBank } from '../../actions';
import Bank from '../../bank';
import { HeaderPanel, LoadingPanel } from '../../components';
import * as ROUTES from '../../constants/routes';
import helpers from '../../helpers';
import { AppState } from '../../store';

interface IProps {
  authUser: firebase.User|null;
  bank: Bank.IBank;
  bankLoaded: boolean;
  onLoadBank: (uid: string) => void;
}

class DashboardPageBase extends React.Component<IProps, {}> {
  constructor(props: any) {
    super(props);

    this.state = {
      loading: true,
      bank: ({} as Bank.IBank)
    }
  }

  componentDidMount() {
    const { authUser, onLoadBank, bankLoaded } = this.props;
    if (bankLoaded || !authUser ) return;
    
    onLoadBank(authUser.uid);
  }

  render() {
    const { bankLoaded, bank } = this.props;

    if (!bankLoaded) return <LoadingPanel />;

    return (
      <>
        <HeaderPanel title="Last updates" />
        <Container fluid className="top-shadow">
          <Row>
            <Col>
              <Container>
                <Row>
                  <Col>
                    <ListGroup flush>
                      {bank.lastupdate.savings && <ListGroupItem>
                        <NavLink to={ROUTES.SAVINGS}>Savings</NavLink>
                        <span className="pull-right">
                          Last update <b>{bank.lastupdate.savings}</b>
                        </span>
                      </ListGroupItem>}
                      {bank.lastupdate.income && <ListGroupItem>
                        <NavLink to={ROUTES.REVENUES}>Revenues</NavLink>
                        <span className="pull-right">
                          Last update <b>{bank.lastupdate.income}</b>
                        </span>
                      </ListGroupItem>}
                      {bank.lastupdate.others && <ListGroupItem>
                        <NavLink to={helpers.currentMonthRoute()}>Others (Net worth, Expenses...)</NavLink>
                        <span className="pull-right">
                          Last update <b>{bank.lastupdate.others}</b>
                        </span>
                      </ListGroupItem>}
                      {bank.lastupdate.headers && <ListGroupItem>
                        <NavLink to={ROUTES.SETTINGS}>Settings</NavLink>
                        <span className="pull-right">
                          Last update <b>{bank.lastupdate.headers}</b>
                        </span>
                      </ListGroupItem>}
                    </ListGroup>
                  </Col>
                </Row>
              </Container>
            </Col>
          </Row>
        </Container>
      </>
    );
  }
}

const mapStateToProps = (state: AppState) => {
  return ({
    bank: state.bankState.bank,
    bankLoaded: state.bankState.bankLoaded
  });
}

const mapDispatchToProps = (dispatch: Dispatch<any>) => {
  return {
    onLoadBank: (uid: string) => {
      dispatch(loadBank(uid));
    }
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(DashboardPageBase);
