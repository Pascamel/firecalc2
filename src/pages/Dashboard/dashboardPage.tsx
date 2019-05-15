import React from 'react';
import { NavLink } from 'react-router-dom';
import { Col, Container, ListGroup, ListGroupItem, Row } from 'reactstrap';

import * as Bank from '../../bank';
import { HeaderPanel, LoadingPanel } from '../../components';
import * as ROUTES from '../../constants/routes';
import helpers from '../../helpers';
import bankReducer from '../../reducers/bank';

interface IState {
  loading: boolean,
  bank: Bank.IBank
}

export default class DashboardPageBase extends React.Component<{}, IState> {
  constructor(props: any) {
    super(props);

    this.state = {
      loading: true,
      bank: ({} as Bank.IBank) //new Bank()
    }
  }

  componentDidMount() {
    // Bank
    Bank.load('123').then((b: Bank.IBank) => {
      this.setState({bank: b, loading: false});
    }).catch(function(error) {
    });
  }

  render() {
    const { loading, bank } = this.state;

    return (
      <React.Fragment>
        {loading && <LoadingPanel />}
        {!loading && <HeaderPanel title="Last updates" />}
        {!loading && <Container fluid className="top-shadow">
          <Row>
            <Col>
              <Container>
                <Row>
                  <Col>
                    <ListGroup flush>
                      {bank.lastupdate.netWorth && <ListGroupItem>
                        <NavLink to={helpers.currentMonthRoute()}>Net worth</NavLink>
                        <span className="pull-right">
                          Last update <b>{bank.lastupdate.netWorth}</b>
                        </span>
                      </ListGroupItem>}
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
        </Container>}
      </React.Fragment>
    );
  }
}
